import { Form, Input, InputNumber, Button, MessagePlugin, Select } from 'tdesign-react';
import { createMember } from '../services/member';

export default function MemberForm({ onSuccess }) {
  const [form] = Form.useForm();
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    getMemberLevels().then(data => setLevels(data));
  }, []);

  const handleSubmit = async () => {
    try {
      await form.validate();
      const values = form.getFieldsValue(true);
      await createMember(values);
      MessagePlugin.success('会员注册成功');
      form.reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form form={form} labelWidth={100}>
      <Form.Item label="会员姓名" name="name" rules={[{ required: true }]}>
        <Input placeholder="请输入会员姓名" />
      </Form.Item>
      <Form.Item label="手机号码" name="mobile" rules={[{ required: true, pattern: /^1\d{10}$/ }]}>
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item label="会员等级" name="levelId">
        <Select options={levels.map(l => ({ label: l.name, value: l.id }))} />
      </Form.Item>
      <Form.Item>
        <Button type="submit" theme="primary" onClick={handleSubmit}>
          注册
        </Button>
      </Form.Item>
    </Form>
  );
}