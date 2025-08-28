          <DatePicker 
            value={date} 
            onChange={setDate}
            placeholder="选择日期"
          />
          <Button 
            loading={loading}
            onClick={() => {
              // 实际项目中这里调用导出API
              const csvContent = [
                '订单号,时间,金额,支付方式',
                ...report.orders.map(o => 
                  `${o.orderNo},${o.time},${o.amount},${o.paymentMethod}`
                )
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `日结报表_${date.toISOString().split('T')[0]}.csv`;
              link.click();
            }}
          >
            导出CSV
          </Button>
