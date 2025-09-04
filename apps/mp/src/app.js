import { Component } from 'react';
import { createStore } from 'redux';
import './app.css';

// 示例的 reducer 函数
const rootReducer = (state = {}, action) => {
  return state;
};

// 创建全局 store
const store = createStore(rootReducer);

class App extends Component {
  componentDidMount() {
    console.log('小程序启动');
    // 可以在这里进行全局状态的初始化操作
    // 例如 store.dispatch({ type: 'INITIALIZE' })
  }

  componentDidShow() {
    console.log('小程序显示');
  }

  componentDidHide() {
    console.log('小程序隐藏');
  }

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
