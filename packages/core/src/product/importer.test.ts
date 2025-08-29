import { describe, it, expect, vi } from 'vitest';
import { ProductImporter } from './importer';
import { ProductService } from './service';

describe('ProductImporter', () => {
  it('should import products from CSV data', async () => {
    const productService = new ProductService();
    const importer = new ProductImporter(productService);
    
    // Mock CSV data
    const csvData = `
name,price,barcode
Product A,100,12345
Product B,200,67890
`.trim();

    // Mock the CSV parser
    vi.spyOn(importer as any, 'parseCSV').mockImplementation(() => [
      { name: 'Product A', price: '100', barcode: '12345' },
      { name: 'Product B', price: '200', barcode: '67890' }
    ]);

    const result = await importer.importFromCSV(csvData);
    
    expect(result.success).toBe(2);
    expect(result.failed).toBe(0);
  });

  it('should handle invalid price data', async () => {
    const productService = new ProductService();
    const importer = new ProductImporter(productService);
    
    // Mock CSV data with invalid price
    const csvData = `
name,price,barcode
Product A,invalid,12345
Product B,200,67890
`.trim();

    // Mock the CSV parser
    vi.spyOn(importer as any, 'parseCSV').mockImplementation(() => [
      { name: 'Product A', price: 'invalid', barcode: '12345' },
      { name: 'Product B', price: '200', barcode: '67890' }
    ]);

    const result = await importer.importFromCSV(csvData);
    
    expect(result.success).toBe(1);
    expect(result.failed).toBe(1);
  });

  it('should handle empty CSV data', async () => {
    const productService = new ProductService();
    const importer = new ProductImporter(productService);
    
    // Mock empty CSV data
    const csvData = ``;

    // Mock the CSV parser
    vi.spyOn(importer as any, 'parseCSV').mockImplementation(() => []);

    const result = await importer.importFromCSV(csvData);
    
    expect(result.success).toBe(0);
    expect(result.failed).toBe(0);
  });

  it('should handle missing required fields', async () => {
    const productService = new ProductService();
    const importer = new ProductImporter(productService);
    
    // Mock CSV data with missing required fields
    const csvData = `
name,price,barcode
Product A,100,12345
,200,67890
Product C,,11111
`.trim();

    // Mock the CSV parser
    vi.spyOn(importer as any, 'parseCSV').mockImplementation(() => [
      { name: 'Product A', price: '100', barcode: '12345' },
      { name: '', price: '200', barcode: '67890' },
      { name: 'Product C', price: '', barcode: '11111' }
    ]);

    const result = await importer.importFromCSV(csvData);
    
    expect(result.success).toBe(1);
    expect(result.failed).toBe(2);
  });
});