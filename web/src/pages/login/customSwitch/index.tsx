import { Switch } from 'antd';
import './index.less'
import { useState } from 'react';

const CustomSwitch = () => {

  const [isDarkTheme, setThemeColor] = useState<any>(true)

    /**
   * @description 切换主题色
   * @param value 是否check值
   */
  const handleThemeChange = (value: any) => {
    console.log('value', value)
    setThemeColor(value)
    console.log(document.querySelector('.checkedSwitch'))
  }

    return <Switch 
      onChange={handleThemeChange} 
      className={!isDarkTheme ? 'uncheckedSwitch' : 'checkedSwitch'} 
      value={isDarkTheme}
    />
}

export default CustomSwitch