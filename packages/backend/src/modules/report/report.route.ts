import { Hono } from 'hono';
import { getSummary } from './report.controller';

const report = new Hono();

report.get('/summary', ...getSummary);

export default report;
