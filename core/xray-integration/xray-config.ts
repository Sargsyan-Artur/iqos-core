import 'dotenv/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormData from 'form-data';

export const formData = new FormData();

export const xrayConfig = {
  baseUrl: 'https://jira.app.pconnect.biz',
  token: process.env.TOKEN
};

export const xrayHeaders = {
  basic: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${xrayConfig.token}`
  },
  multipart: {
    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    Authorization: `Bearer ${xrayConfig.token}`
  }
};
