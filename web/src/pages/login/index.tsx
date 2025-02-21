import { useLogin, useRegister } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import { Button, Form, Input, message } from 'antd';
import { Popover } from 'antd-mobile'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, useNavigate } from 'umi';
// import RightPanel from './right-panel';
import ZhIcon from './menuIcons/zh-icon'
import EnIcon from './menuIcons/en-icon'
// import IconZh from '@/assets/svg/icon_zh.svg'
// import IconEn from '@/assets/svg/icon_En.svg'
import { Domain } from '@/constants/common';
import styles from './index.less';
import SvgIcon from '@/components/svg-icon';
import CustomSwitch from './customSwitch';


const Login = () => {
  const [title, setTitle] = useState('login');

  const navigate = useNavigate();

  const { login, loading: signLoading } = useLogin();

  const { register, loading: registerLoading } = useRegister();

  const [languageTitle, setLanguageTitle] = useState<string>('中文')

  const [languageIcon, setLanguageIcon] = useState<any>('icon_zh')

  // 国际化
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'login' });

  // const [isDarkTheme, setThemeColor] = useState<any>(false)

  const loading = signLoading || registerLoading;

  const languageOptions = [
    // { value: '中文' },
    // { value: 'English' }
    { key: 'zh', text: '中文', icon: <ZhIcon />, iconName: 'icon_zh' },
    { key: 'en', text: 'English', icon: <EnIcon />, iconName: 'icon_En' },
  ]

  const [form] = Form.useForm();

  useEffect(() => {
    form.validateFields(['nickname']);
  }, [form]);

  const onCheck = async () => {
    try {
      const params = await form.validateFields();
      const { password, confirmPassword } = params
      if(title === 'register' && password !== confirmPassword) {
        message.warning(t('registWarning'))
        return false
      }
      const rsaPassWord = rsaPsw(params.password) as string;
      if (title === 'login') {
        const code = await login({
          email: `${params.email}`.trim(),
          password: rsaPassWord,
        });
        if (code === 0) {
          navigate('/knowledge');
        }
      } else {
        const code = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) {
          setTitle('login');
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const changeTitle = () => {
    setTitle((title) => (title === 'login' ? 'register' : 'login'));
    form.setFieldsValue({})
    form.resetFields()
  };

  /**
   * @description 切换主题色
   * @param value 是否check值
   */
  // const handleThemeChange = (value: any) => {
  //   console.log('value', value)
  //   setThemeColor(value)
  //   console.log(document.querySelector('.checkedSwitch'))
  // }

  /**
   * @description 切换语言
   * @param node 语言信息
   */
  const changeLanguage = (node: any) => {
    setLanguageTitle(node.text)
    setLanguageIcon(node.iconName)
    i18n.changeLanguage(node.key) // 参值为'en'或'zh'
  }

  const formItemLayout = {
    labelCol: { span: 8 },
    // wrapperCol: { span: 8 },
  };

  const toGoogle = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?scope=user:email&client_id=302129228f0d96055bee';
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.leftContainer}>
        <div className={styles.sytemTitle}>
          <div>
            {t('systemTitle1')}
            <SvgIcon name="sparkle" width={12}></SvgIcon>
            {t('systemTitle2')}
          </div>
          <div>{t('introduce')}</div>
          <div>{t('loginTip')}</div>
        </div>
        <div className={styles.bottomTitle}>
          <span>{t('zhongding')}</span>
          <span>{t('zhihui')}</span>
          <span>{t('funeng')}</span>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.modePanel}>
          {/* <Switch
            onChange={handleThemeChange}
            className={!isDarkTheme ? styles.uncheckedSwitch : styles.checkedSwitch}
          /> */}
          <CustomSwitch />
          <div className={styles.language}>
            <Popover.Menu
              actions={languageOptions}
              placement="bottom-start"
              trigger="click"
              className='languagePopover'
              onAction={(node: any) => changeLanguage(node)}
            >
              <div className={styles.languageSelect}>
                <SvgIcon name={languageIcon} width={24} />
                <div className={styles.languageTitle}>{languageTitle}</div>
                <SvgIcon name={'chevron-down'} width={13} color='#ccc' />
              </div>
            </Popover.Menu>
          </div>
        </div>
        <div className={styles.loginFormPanel}>
          <div className={styles.cropLogo}>
            <SvgIcon name='zd' width={21} />
            <div>{t('zhongding')}</div>
          </div>
          <div className={styles.loginTitle}>
            <div>{title === 'login' ? t('userlogin') : t('register')}</div>
            <span>
              {title === 'login'
                ? t('loginDescription')
                : t('registerDescription')}
            </span>
          </div>
          <Form
            form={form}
            layout="vertical"
            name="dynamic_rule"
            style={{ maxWidth: 600 }}
          >
            {title === 'register' && (
              <>
                <Form.Item
                  {...formItemLayout}
                  name="email"
                  label={t('emailLabel')}
                  rules={[
                    { required: true, message: t('emailPlaceholder') },
                    {
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('emailCheck'),
                    }
                  ]}
                >
                  <Input size="large" placeholder={t('emailPlaceholder')} className={styles.loginInput} />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  name="nickname"
                  label={t('nameLabel')}
                  rules={[{ required: true, message: t('namePlaceholder') }]}
                >
                  <Input size="large" placeholder={t('namePlaceholder')} />
                </Form.Item>
              </>
            )}
            {/* <Form.Item
            {...formItemLayout}
            name="email"
            label={t('emailLabel')}
            rules={[{ required: true, message: t('emailPlaceholder') }]}
          >
            <Input size="large" placeholder={t('emailPlaceholder')} />
          </Form.Item> */}
            {title === 'login' && (
              <Form.Item
                {...formItemLayout}
                name="email"
                label={t('nicknameLabel')}
                rules={[{ required: true, message: t('nicknamePlaceholder') }]}
              >
                <Input size="large" placeholder={t('nicknamePlaceholder')} className={styles.loginInput} />
              </Form.Item>
            )}
            <Form.Item
              {...formItemLayout}
              name="password"
              label={t('passwordLabel')}
              rules={[{ required: true, message: t('passwordPlaceholder') }]}
            >
              <Input.Password
                size="large"
                placeholder={t('passwordPlaceholder')}
                // onPressEnter={onCheck}
                className={styles.loginInput}
              />
            </Form.Item>
            {title === 'register' && (
              <Form.Item
                {...formItemLayout}
                name="confirmPassword"
                label={t('confirmPwLabel')}
                rules={[{ required: true, message: t('confirmPwPlaceholder') }]}
              >
                <Input.Password size="large" placeholder={t('confirmPwPlaceholder')} className={styles.loginInput} />
              </Form.Item>
            )}
            {/* {title === 'login' && (
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox> {t('rememberMe')}</Checkbox>
              </Form.Item>
            )} */}
            <Button
              type="primary"
              block
              size="large"
              onClick={onCheck}
              loading={loading}
              className={styles.loginBtn}
            >
              {title === 'login' ? t('login') : t('regist')}
            </Button>
            <div className={styles.forgetTipPanel}>
              {title === 'login' && (
                <>
                  <div>
                    {t('withoutAccount')}
                    <a onClick={changeTitle} className={styles.registLink}>
                      {t('currentRegist')}
                    </a>
                  </div>
                  <div>
                    {t('signInTip')}
                    <a onClick={changeTitle} className={styles.connectLink}>
                      {t('connectAdmin')}
                    </a>
                  </div>
                </>
              )}
              {title === 'register' && (
                <div>
                  {t('signUpTip')}
                  <a onClick={changeTitle} className={styles.registLink}>
                    {t('login')}
                  </a>
                </div>
              )}
            </div>
            {title === 'login' && (
              <>
                {/* <Button
                  block
                  size="large"
                  onClick={toGoogle}
                  style={{ marginTop: 15 }}
                >
                  <div>
                    <Icon
                      icon="local:google"
                      style={{ verticalAlign: 'middle', marginRight: 5 }}
                    />
                    Sign in with Google
                  </div>
                </Button> */}
                {location.host === Domain && (
                  <Button
                    block
                    size="large"
                    onClick={toGoogle}
                    style={{ marginTop: 15 }}
                  >
                    <div className="flex items-center">
                      <Icon
                        icon="local:github"
                        style={{ verticalAlign: 'middle', marginRight: 5 }}
                      />
                      Sign in with Github
                    </div>
                  </Button>
                )}
              </>
            )}
          </Form>
        </div>
        <div className={styles.copyrightPanel}>
          {t('copyright')}
        </div>
        <div className={styles.decorationBg}></div>
      </div>
    </div>
  );
};

export default Login;
