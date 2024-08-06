import useDocApi, { Doc } from '@/api/doc';
import useFileApi from '@/api/file';
import { IPage } from '@/api/interface';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { IDocEditorProps, OfficeEditor } from '@office-editor/react';
import { useNavigate } from '@umijs/max';
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Tag,
  Upload,
  message,
} from 'antd';
import Cookies from 'js-cookie';
import { useRef, useState } from 'react';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const DocForm: React.FC<{ destroy: () => void }> = ({ destroy }) => {
  const docApi = useDocApi();

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const fileApi = useFileApi();

  const [file, setFile] = useState<any[]>();

  return (
    <Spin spinning={loading}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={async (value) => {
          setLoading(true);
          docApi
            .saveOrUpdate({ ...value, file: JSON.stringify(file) })
            .then((res) => {
              const { code, message } = res;
              if (code === 200) {
                messageApi.success(message);
                destroy?.();
              } else {
                messageApi.error(message);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        autoComplete="off"
      >
        <Form.Item label="文档名称" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="文档标签" name="label">
          <Input />
        </Form.Item>

        <Form.Item label="文档">
          <Upload.Dragger
            accept=".doc,.docx,.xlsx,.xls,.ppt,.pptx"
            onChange={(info) => {
              const { file } = info;
              if (file.status === 'done') {
                const { response } = file;
                setFile([response?.data]);
              }
            }}
            maxCount={1}
            name="file"
            action="/api/sys/attachment/upload"
            headers={{ 'X-AUTHENTICATION': Cookies.get('X-AUTHENTICATION') }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="reset">reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default () => {
  const actionRef = useRef<ActionType>();

  const [docId, setDocId] = useState<string>();
  const [show, setShow] = useState<boolean>(false);

  const docEditorRef = useRef<IDocEditorProps | undefined>();

  const defaultPage: IPage<Doc> = {
    current: 1,
    size: 100,
  };

  const navigate = useNavigate();

  const docApi = useDocApi();

  const columns: ProColumns<Doc>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '文档名称',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      tooltip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      title: '文件',
      dataIndex: 'file',
      valueType: 'image',
      search: false,
    },
    {
      disable: true,
      title: '标签',
      dataIndex: 'label',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.label?.split(',').map(({ name, color }) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInForm: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '70%',
      render: (text, record, _, action) => [
        <Button key="1" type="primary" onClick={() => {}}>
          编辑
        </Button>,
        <Button
          key="2"
          onClick={() => {
            navigate(`/editor/${record.id}`);
          }}
        >
          查看
        </Button>,
        <Button
          key="3"
          onClick={() => {
            setDocId(record.id);
            setShow(true);
          }}
        >
          显示
        </Button>,
        <Button
          key="3"
          onClick={() => {
            setDocId(undefined);
            setShow(false);
          }}
        >
          关闭
        </Button>,
        <Button
          key="4"
          onClick={() => {
            docEditorRef.current?.triggerKickout(['1']);
          }}
        >
          踢出
        </Button>,
        <Button
          key="4"
          onClick={() => {
            docEditorRef.current?.triggerKickoutAll();
          }}
        >
          踢出所有人
        </Button>,
        <Button
          key="4"
          onClick={() => {
            docEditorRef.current?.triggerKickoutOthers();
          }}
        >
          踢出其他人
        </Button>,
        <Button
          key="4"
          onClick={() => {
            docEditorRef.current?.triggerForceSave();
          }}
        >
          强制保存
        </Button>,
        <Button
          key="4"
          onClick={() => {
            docEditorRef.current?.onlineDocUser((user) => {
              console.log(user);
            });
          }}
        >
          在线用户
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Doc>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          return docApi
            .page(
              {
                current: params.current,
                size: params.pageSize,
              },
              filter,
            )
            .then((res) => {
              return {
                data: res.data?.records || [],
                success: res.code === 200,
              };
            });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: defaultPage.size,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              const modal = Modal.info({
                content: <DocForm destroy={modal?.destroy} />,
                closable: true,
                footer: null,
                width: '50%',
              });
            }}
            type="primary"
          >
            新建
          </Button>,
          <ModalForm
            trigger={
              <Button type="primary">
                <PlusOutlined />
                设置token
              </Button>
            }
            onFinish={async (values: any) => {
              Cookies.set('X-AUTHENTICATION', values.token);
              message.success('修改成功');
              document.location.reload();
            }}
          >
            <ProFormText width="md" name="token" label="token" />
          </ModalForm>,
        ]}
      />

      <p>
        管理员token：
        <p>
          eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsImF2YXRhciI6Imh0dHA6Ly8xMjcuMC4wLjE6ODYwMC9zeXMvYXR0YWNobWVudC9kb3dubG9hZC8xMTM1NDMxODlfcDBfbWFzdGVyMTIwMC5qcGciLCJ1c2VySWQiOjExNjYwMTA3MjEzOTAwMzQ5NDQsImVuYWJsZWQiOnRydWUsImF1dGhvcml0aWVzIjpbeyJyb2xlSWQiOjExNzc5NzA4ODA5OTU3ODY3NTIsInJvbGVDb2RlIjoiMjEiLCJyb2xlTmFtZSI6IjIxIn0seyJyb2xlSWQiOjExNzc5NzA1MDA5NTgxNTg4NDgsInJvbGVDb2RlIjoiYXNkIiwicm9sZU5hbWUiOiJ3YXNhZCJ9LHsicm9sZUlkIjoxMTc0MDQ1MzUyNzAyMzc3OTg0LCJyb2xlQ29kZSI6ImFzZDIxMjEiLCJyb2xlTmFtZSI6ImFzZCJ9LHsicm9sZUlkIjoxMTc0MDQ1NTA0OTQ4MjczMTUyLCJyb2xlQ29kZSI6ImFzZDIxMjEiLCJyb2xlTmFtZSI6ImFzZCJ9LHsicm9sZUlkIjoxMTcyNDg2MTg2NjE1MTc3MjE2LCJyb2xlQ29kZSI6IjMyIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3NDA0NTQ3MjI4MjM3ODI0MCwicm9sZUNvZGUiOiJhc2QyMTIxIiwicm9sZU5hbWUiOiJhc2QifV0sInBhc3N3b3JkIjoiZmVFU29uUmNJc25qZ1hhRnhCVjRBQT09IiwicGhvbmUiOiIxMjMxMTMxMyIsIm5pY2tuYW1lIjoiampqampqamoiLCJ0ZW5hbnRJZCI6MCwiYWNjb3VudE5vbkV4cGlyZWQiOnRydWUsImV4cCI6MTcxOTA0NDkyNiwiaWF0IjoxNzE4OTU4NTI2LCJqdGkiOiIxMTY2MzU5NTA5NzYwMDAwIiwiZW1haWwiOiJqaWFuZ3cxMDI3QGdtYWlsLmNvbSIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.bw8hJsP7iW25AXFG3eKfJuSsvnuCaPiprq6G8XgFtC2uUdU636dK7shHt3WE6QWSeuMC06x1dAuGYThYX6MhUSSkzJhd4oNCwCuSPkMRi-xtOuA1AdLr-e6u5JvYKQqaVfLTs7mASOzdI61SRtE91he0f-nlWej6cdiPWXs_6QFtCTulXySV4XJ3J79eYmuCXfEV4Npt6WIGKlpo8yzJQtZp4McDzFDeRHOLw381_638BELU6mbu-G-G2ORHCzWS6lPbtfVERSYmrUaIesu25Ztlpk6JGMh6_CH0rJhr6SIsY2QH4v_JLkWvPVA-XS8MutP6I0Mf_0iE5BUykCMLYQ
        </p>
      </p>
      <p>
        cy66token：
        <p>
          eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE3MTU3ODU3MzM0MjQiLCJleHAiOjM3NzE1Nzg3NTMzLCJhY2NvdW50IjoiY3MzeSJ9.Rliuez4zKrRb3eRAZl69KihphlvL0KoOYoppQxXNIcM
        </p>
      </p>

      {show && docId !== undefined && (
        <div style={{ height: '100vh', width: '100vw' }}>
          <OfficeEditor
            printLog={true}
            docId={docId}
            onDocumentReady={(docEditor) => {
              docEditorRef.current = docEditor;
            }}
            onDocumentBeforeDestroy={() => {
              console.log(this);
              docEditorRef.current = null;
            }}
          />
        </div>
      )}
    </>
  );
};
