import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  latitude?: number;
  longitude?: number;
  imageData?: string;
  walletAddress: string;
  verifications: string[]; // Array of wallet addresses that verified
  verifiedCount: number;
  isVerified: boolean;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  walletAddress: string;
  text: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: 'report' | 'verification' | 'comment';
  reportId: string;
  reportTitle: string;
  walletAddress: string;
  createdAt: string;
}

// Get all reports
app.get('/make-server-54870fc4/reports', async (c) => {
  try {
    const reports = await kv.getByPrefix('report:');
    console.log('Fetched reports:', reports.length);
    
    // Sort by creation date, newest first
    const sortedReports = reports.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ success: true, reports: sortedReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return c.json({ success: false, error: 'Failed to fetch reports' }, 500);
  }
});

// Get single report
app.get('/make-server-54870fc4/reports/:id', async (c) => {
  try {
    const reportId = c.req.param('id');
    const report = await kv.get<Report>(reportId);
    
    if (!report) {
      return c.json({ success: false, error: 'Report not found' }, 404);
    }

    return c.json({ success: true, report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return c.json({ success: false, error: 'Failed to fetch report' }, 500);
  }
});

// Submit a new report
app.post('/make-server-54870fc4/reports', async (c) => {
  try {
    const body = await c.req.json();
    const { title, description, category, desa, kecamatan, kabupaten, provinsi, latitude, longitude, imageData, walletAddress } = body;

    if (!title || !description || !category || !desa || !kecamatan || !kabupaten || !provinsi || !walletAddress) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: title, description, category, desa, kecamatan, kabupaten, provinsi, walletAddress' 
      }, 400);
    }

    const reportId = `report:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    const newReport: Report = {
      id: reportId,
      title,
      description,
      category,
      desa,
      kecamatan,
      kabupaten,
      provinsi,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      imageData,
      walletAddress,
      verifications: [],
      verifiedCount: 0,
      isVerified: false,
      createdAt,
      comments: [],
    };

    await kv.set(reportId, newReport);
    
    // Create activity
    const activityId = `activity:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const activity: Activity = {
      id: activityId,
      type: 'report',
      reportId,
      reportTitle: title,
      walletAddress,
      createdAt,
    };
    await kv.set(activityId, activity);
    
    console.log('Created new report:', reportId);

    return c.json({ success: true, report: newReport });
  } catch (error) {
    console.error('Error creating report:', error);
    return c.json({ success: false, error: 'Failed to create report' }, 500);
  }
});

// Verify a report
app.post('/make-server-54870fc4/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { reportId, walletAddress } = body;

    if (!reportId || !walletAddress) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: reportId, walletAddress' 
      }, 400);
    }

    const report = await kv.get<Report>(reportId);
    
    if (!report) {
      return c.json({ success: false, error: 'Report not found' }, 404);
    }

    // Check if user is the reporter
    if (report.walletAddress === walletAddress) {
      return c.json({ 
        success: false, 
        error: 'Cannot verify your own report' 
      }, 400);
    }

    // Check if user already verified
    if (report.verifications.includes(walletAddress)) {
      return c.json({ 
        success: false, 
        error: 'You have already verified this report' 
      }, 400);
    }

    // Check if already verified
    if (report.isVerified) {
      return c.json({ 
        success: false, 
        error: 'Report is already verified' 
      }, 400);
    }

    // Add verification
    report.verifications.push(walletAddress);
    report.verifiedCount = report.verifications.length;

    // Check if report is now verified (3 verifications)
    if (report.verifiedCount >= 3) {
      report.isVerified = true;
    }

    await kv.set(reportId, report);
    
    // Create activity
    const activityId = `activity:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const activity: Activity = {
      id: activityId,
      type: 'verification',
      reportId,
      reportTitle: report.title,
      walletAddress,
      createdAt: new Date().toISOString(),
    };
    await kv.set(activityId, activity);
    
    console.log(`Report ${reportId} verified by ${walletAddress}. Count: ${report.verifiedCount}`);

    return c.json({ success: true, report });
  } catch (error) {
    console.error('Error verifying report:', error);
    return c.json({ success: false, error: 'Failed to verify report' }, 500);
  }
});

// Add comment to report
app.post('/make-server-54870fc4/comments', async (c) => {
  try {
    const body = await c.req.json();
    const { reportId, walletAddress, text } = body;

    if (!reportId || !walletAddress || !text) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: reportId, walletAddress, text' 
      }, 400);
    }

    const report = await kv.get<Report>(reportId);
    
    if (!report) {
      return c.json({ success: false, error: 'Report not found' }, 404);
    }

    const commentId = `comment:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const comment: Comment = {
      id: commentId,
      walletAddress,
      text,
      createdAt: new Date().toISOString(),
    };

    if (!report.comments) {
      report.comments = [];
    }
    report.comments.push(comment);

    await kv.set(reportId, report);
    
    // Create activity
    const activityId = `activity:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const activity: Activity = {
      id: activityId,
      type: 'comment',
      reportId,
      reportTitle: report.title,
      walletAddress,
      createdAt: new Date().toISOString(),
    };
    await kv.set(activityId, activity);
    
    console.log(`Comment added to report ${reportId}`);

    return c.json({ success: true, report });
  } catch (error) {
    console.error('Error adding comment:', error);
    return c.json({ success: false, error: 'Failed to add comment' }, 500);
  }
});

// Get activities
app.get('/make-server-54870fc4/activities', async (c) => {
  try {
    const activities = await kv.getByPrefix('activity:');
    console.log('Fetched activities:', activities.length);
    
    // Sort by creation date, newest first
    const sortedActivities = activities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 20); // Limit to 20 most recent
    
    return c.json({ success: true, activities: sortedActivities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return c.json({ success: false, error: 'Failed to fetch activities' }, 500);
  }
});

// Get leaderboard
app.get('/make-server-54870fc4/leaderboard', async (c) => {
  try {
    const reports = await kv.getByPrefix('report:');
    
    // Count reports per user
    const reportCounts: Record<string, number> = {};
    reports.forEach(report => {
      reportCounts[report.walletAddress] = (reportCounts[report.walletAddress] || 0) + 1;
    });
    
    // Count verifications per user
    const verificationCounts: Record<string, number> = {};
    reports.forEach(report => {
      report.verifications.forEach((wallet: string) => {
        verificationCounts[wallet] = (verificationCounts[wallet] || 0) + 1;
      });
    });
    
    // Convert to arrays and sort
    const topReporters = Object.entries(reportCounts)
      .map(([wallet, count]) => ({ wallet, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const topVerifiers = Object.entries(verificationCounts)
      .map(([wallet, count]) => ({ wallet, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return c.json({ 
      success: true, 
      leaderboard: {
        topReporters,
        topVerifiers,
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ success: false, error: 'Failed to fetch leaderboard' }, 500);
  }
});

Deno.serve(app.fetch);
