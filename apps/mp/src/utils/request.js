const request = (options) => {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options;
    
    // 这里可以添加统一的请求头处理
    const defaultHeader = {
      'Content-Type': 'application/json',
      ...header
    };
    
    // 模拟请求
    console.log(`请求 ${method}: ${url}`, data);
    
    // 模拟响应
    setTimeout(() => {
      // 模拟成功响应
      if (Math.random() > 0.2) {
        resolve({
          data: {
            code: 200,
            message: 'success',
            data: {}
          }
        });
      } else {
        // 模拟失败响应
        reject({
          errMsg: '网络请求失败'
        });
      }
    }, 500);
  });
};

export default request;