import { describe, it, expect } from 'vitest';
import { ProductImporter } from './importer';

describe('ProductImporter', () => {
  it('should import valid CSV data', async () => {
    const importer = new ProductImporter();
    const csvData = `name,price,stock
Product 1,100,10
Product 2,200,20`;
    
    const result = await importer.importFromCSV(csvData);
    expect(result.success).toBe(2);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle CSV with missing headers', async () => {
    const importer = new ProductImporter();
    const csvData = `name,price
Product 1,100`;
    
    await expect(importer.importFromCSV(csvData)).rejects.toThrow('缺少必要字段');
  });

  it('should handle empty CSV data', async () => {
    const importer = new ProductImporter();
    const csvData = '';
    
    const result = await importer.importFromCSV(csvData);
    expect(result.success).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should report errors for invalid data', async () => {
    const importer = new ProductImporter();
    const csvData = `name,price,stock
,100,10
Product 2,0,20
Product 3,300,-5
${'a'.repeat(51)},100,10`;
    
    const result = await importer.importFromCSV(csvData);
    expect(result.success).toBe(0);
    expect(result.errors).toHaveLength(4);
    expect(result.errors[0].error).toContain('商品名称不能为空');
    expect(result.errors[1].error).toContain('价格必须是大于0的有效数字');
    expect(result.errors[2].error).toContain('库存必须是非负整数');
    expect(result.errors[3].error).toContain('商品名称不能超过50个字符');
  });

  it('should handle category field validation', async () => {
    const importer = new ProductImporter();
    const csvData = `name,price,stock,category
Product 1,100,10,${'a'.repeat(31)}`;
    
    const result = await importer.importFromCSV(csvData);
    expect(result.success).toBe(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('商品分类不能超过30个字符');
  });
});