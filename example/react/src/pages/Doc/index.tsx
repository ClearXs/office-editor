import useDocApi, { Doc } from '@/api/doc';
import { IPage } from '@/api/interface';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Button, Upload, message } from 'antd';
import Cookies from 'js-cookie';
import { useRef, useState } from 'react';
import Editor from '../Editor';

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

export default () => {
  const actionRef = useRef<ActionType>();

  const [docId, setDocId] = useState<string>();
  const [show, setShow] = useState<boolean>(false);

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
      width: '35%',
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
            window.open(
              `/api/office/v1/doc/download/${
                record.id
              }?X-AUTHENTICATION=${Cookies.get('X-AUTHENTICATION')}&X-TENANT=0`,
            );
          }}
        >
          下载
        </Button>,
        <Button
          key="2"
          onClick={() => {
            navigate(`/urlEditor/${record.id}`);
          }}
        >
          查看url
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
          <Upload
            accept=".doc,.docx,.xlsx,.xls,.ppt,.pptx"
            maxCount={1}
            name="file"
            action="/api/office/v1/doc/saves"
            showUploadList={false}
            headers={{
              'X-AUTHENTICATION': Cookies.get('X-AUTHENTICATION'),
              'X-TENANT': '0',
            }}
          >
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>,
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
            <ProFormTextArea name="token" label="token" />

            <p>
              管理员token：
              <p>
                eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsInVzZXJJZCI6MTE2NjAxMDcyMTM5MDAzNDk0NCwiZW5hYmxlZCI6dHJ1ZSwiYXV0aG9yaXRpZXMiOlt7InJvbGVJZCI6MTE3MjQ4NjE4NjYxNTE3NzIxNiwicm9sZUNvZGUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3Nzk3MDUwMDk1ODE1ODg0OCwicm9sZUNvZGUiOiJhc2QiLCJyb2xlTmFtZSI6Indhc2FkIn0seyJyb2xlSWQiOjExNzQwNDU0NzIyODIzNzgyNDAsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzQwNDU1MDQ5NDgyNzMxNTIsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzc5NzA4ODA5OTU3ODY3NTIsInJvbGVDb2RlIjoiMjEiLCJyb2xlTmFtZSI6IjIxIn0seyJyb2xlSWQiOjExNzQwNDUzNTI3MDIzNzc5ODQsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn1dLCJwYXNzd29yZCI6ImZlRVNvblJjSXNuamdYYUZ4QlY0QUE9PSIsImFkbWluaXN0cmF0b3IiOnRydWUsImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJleHAiOjQ4ODA1MTA2NjgsImlhdCI6MTcyNDgzNzA2OCwianRpIjoiMTFiZGNlNzBkYjcyMDAwMCIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.m8Cmwm7zYaBXsrNXzrx2gMmbtMwcfpjloFgM5wQUWXHADOikBGuY5oLOF50pAzMd8MRZxfuPMEKdR7lmOo_xxcs_t0TSriVGmMQ0rIUCk4r6digoKpgOJLoXzMIilP3QZ3ZSZ4HAU5MYgzFk579eE1za5fqQUTiabCBCqos0lAqC7rtO8STf7jG8TFRJCooQo3ml1W-CI0DDAB3x1NGeP5SPRK-xIlOYRNeiubz886VSDU9t7AYvvqsvzuuiiRLZf4tGpCCRkPN-aphfsqBt0WcIZCdeWyAE4S_lv3PMfZcO1cxiitgVf7e34tWyXJCejDAeJtNCCdnIgT5Wint62w
              </p>
            </p>
          </ModalForm>,
        ]}
      />
      {show && docId !== undefined && <Editor docId={docId}></Editor>}
    </>
  );
};
