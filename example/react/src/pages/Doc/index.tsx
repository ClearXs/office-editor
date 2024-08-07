import useDocApi, { Doc } from '@/api/doc';
import { IPage } from '@/api/interface';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { IEditor, OfficeEditor } from '@office-editor/react';
import { useNavigate } from '@umijs/max';
import { Button, Upload, message } from 'antd';
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

export default () => {
  const actionRef = useRef<ActionType>();

  const [docId, setDocId] = useState<string>();
  const [show, setShow] = useState<boolean>(false);

  const docEditorRef = useRef<IEditor | undefined>();

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
          <Upload
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
            action="/api/office/v1/doc/saves"
            headers={{ 'X-AUTHENTICATION': Cookies.get('X-AUTHENTICATION') }}
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
                eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsImF2YXRhciI6Imh0dHA6Ly8xMjcuMC4wLjE6ODYwMC9zeXMvYXR0YWNobWVudC9kb3dubG9hZC8xMTM1NDMxODlfcDBfbWFzdGVyMTIwMC5qcGciLCJ1c2VySWQiOjExNjYwMTA3MjEzOTAwMzQ5NDQsImVuYWJsZWQiOnRydWUsImF1dGhvcml0aWVzIjpbeyJyb2xlSWQiOjExNzQwNDU0NzIyODIzNzgyNDAsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzc5NzA4ODA5OTU3ODY3NTIsInJvbGVDb2RlIjoiMjEiLCJyb2xlTmFtZSI6IjIxIn0seyJyb2xlSWQiOjExNzc5NzA1MDA5NTgxNTg4NDgsInJvbGVDb2RlIjoiYXNkIiwicm9sZU5hbWUiOiJ3YXNhZCJ9LHsicm9sZUlkIjoxMTc0MDQ1MzUyNzAyMzc3OTg0LCJyb2xlQ29kZSI6ImFzZDIxMjEiLCJyb2xlTmFtZSI6ImFzZCJ9LHsicm9sZUlkIjoxMTcyNDg2MTg2NjE1MTc3MjE2LCJyb2xlQ29kZSI6IjMyIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3NDA0NTUwNDk0ODI3MzE1Miwicm9sZUNvZGUiOiJhc2QyMTIxIiwicm9sZU5hbWUiOiJhc2QifV0sInBhc3N3b3JkIjoiZmVFU29uUmNJc25qZ1hhRnhCVjRBQT09IiwicGhvbmUiOiIxMjMxMTMxMyIsIm5pY2tuYW1lIjoiampqampqamoiLCJ0ZW5hbnRJZCI6MCwiYWNjb3VudE5vbkV4cGlyZWQiOnRydWUsImV4cCI6MTcyMzEwMzAzNCwiaWF0IjoxNzIzMDE2NjM0LCJqdGkiOiIxMWEyYWUwOTA4M2EwMDAwIiwiZW1haWwiOiJqaWFuZ3cxMDI3QGdtYWlsLmNvbSIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.tNWTZDVAxDDXLgVWd2RtnlCX2MSabTpsiZWGypdoaMiVzW2d1de2iA76HEvJAtT8mrTI2elHb8yKm6fQtb0CKgGODQeNiBR7vDJ4fygfaub4nn2xEcyGKV2B3vitDHaFixw9pNTHI1Am98vfdA2IfM63h79KmLj_h6rwCO6xy6xS3LgLoPdeJ44qYVgZPbunVCU575B-d8G7RxtCEZqwUmlVGtXXUwmLHRF2dEsOcyWnUHx32v5carUm5Qp-w8ObTuPrAZjBGFTFSfmQYPG5DiQssVPxiM1CRA5vWs-O7I2YbvLeG8e7jFIYZEqPC2Ho_4P3lREX8IXSZfluUfmRNg
              </p>
            </p>
          </ModalForm>,
        ]}
      />
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
