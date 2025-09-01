import React, { useState, useEffect } from 'react';
import { Button, Table, DatePicker, Message } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';
import { ReportingService, SalesReportData, ProductSalesRanking } from '../../services/reporting';

export default function SalesReportPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>销售报表</h1>
      <p>此功能正在开发中...</p>
    </div>
  );
}
