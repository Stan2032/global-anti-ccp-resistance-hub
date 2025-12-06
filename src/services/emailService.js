import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email service error', { error: error.message });
  } else {
    logger.info('Email service ready');
  }
});

// Email templates
const templates = {
  welcome: (user) => ({
    subject: 'Welcome to Resistance Hub',
    html: `
      <h1>Welcome, ${user.firstName || user.username}!</h1>
      <p>Thank you for joining the Global Anti-CCP Resistance Hub.</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${process.env.APP_URL}/verify-email?token=${user.verificationToken}">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
    `
  }),

  verifyEmail: (user) => ({
    subject: 'Verify Your Email Address',
    html: `
      <h2>Email Verification</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${process.env.APP_URL}/verify-email?token=${user.verificationToken}">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
    `
  }),

  resetPassword: (user) => ({
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${process.env.APP_URL}/reset-password?token=${user.resetToken}">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  }),

  campaignUpdate: (user, campaign) => ({
    subject: `Campaign Update: ${campaign.title}`,
    html: `
      <h2>${campaign.title}</h2>
      <p>${campaign.update}</p>
      <p>Progress: ${campaign.progressPercentage}%</p>
      <a href="${process.env.APP_URL}/campaigns/${campaign.id}">
        View Campaign
      </a>
    `
  }),

  supportRequestResponse: (user, request) => ({
    subject: `New Response to Your Support Request`,
    html: `
      <h2>Support Request: ${request.title}</h2>
      <p>Someone has offered to help with your request!</p>
      <p>${request.helperMessage}</p>
      <a href="${process.env.APP_URL}/support-requests/${request.id}">
        View Details
      </a>
    `
  }),

  messageNotification: (user, sender, message) => ({
    subject: `New Message from ${sender.username}`,
    html: `
      <h2>New Message</h2>
      <p><strong>${sender.username}</strong> sent you a message:</p>
      <p>"${message.preview}..."</p>
      <a href="${process.env.APP_URL}/messages">
        View Message
      </a>
    `
  })
};

export const sendEmail = async (to, templateName, data = {}) => {
  try {
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(data);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      ...emailContent
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent', { to, templateName, messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error('Email send error', { to, templateName, error: error.message });
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail(user.email, 'welcome', user);
};

export const sendVerificationEmail = async (user) => {
  return sendEmail(user.email, 'verifyEmail', user);
};

export const sendPasswordResetEmail = async (user) => {
  return sendEmail(user.email, 'resetPassword', user);
};

export const sendCampaignUpdateEmail = async (userEmail, campaign) => {
  return sendEmail(userEmail, 'campaignUpdate', { campaign });
};

export const sendSupportResponseEmail = async (userEmail, request) => {
  return sendEmail(userEmail, 'supportRequestResponse', { request });
};

export const sendMessageNotificationEmail = async (userEmail, sender, message) => {
  return sendEmail(userEmail, 'messageNotification', { sender, message });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCampaignUpdateEmail,
  sendSupportResponseEmail,
  sendMessageNotificationEmail
};
