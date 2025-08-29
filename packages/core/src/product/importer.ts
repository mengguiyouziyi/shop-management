export class ProductImporter {
  async importFromCSV(csvData: string): Promise<{ success: number; errors: Array<{ line: number; error: string }> }> {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      return { success: 0, errors: [] };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['name', 'price', 'stock'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`缺少必要字段: ${missingHeaders.join(', ')}`);
    }

    let successCount = 0;
    const errors: Array<{ line: number; error: string }> = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) {
          errors.push({ line: i + 1, error: '字段数量不匹配' });
          continue;
        }

        const productData: Record<string, string> = {};
        headers.forEach((header, index) => {
          productData[header] = values[index];
        });

        // 数据验证
        if (!productData.name || productData.name.trim().length === 0) {
          errors.push({ line: i + 1, error: '商品名称不能为空' });
          continue;
        }

        if (productData.name.length > 50) {
          errors.push({ line: i + 1, error: '商品名称不能超过50个字符' });
          continue;
        }

        const price = parseFloat(productData.price);
        if (isNaN(price) || price <= 0) {
          errors.push({ line: i + 1, error: '价格必须是大于0的有效数字' });
          continue;
        }

        const stock = parseInt(productData.stock);
        if (isNaN(stock) || stock < 0) {
          errors.push({ line: i + 1, error: '库存必须是非负整数' });
          continue;
        }

        // 如果有分类字段，也进行验证
        if (productData.category && productData.category.length > 30) {
          errors.push({ line: i + 1, error: '商品分类不能超过30个字符' });
          continue;
        }

        successCount++;
      } catch (err: any) {
        errors.push({ line: i + 1, error: err.message || '导入失败' });
      }
    }

    return { success: successCount, errors };
  }
}