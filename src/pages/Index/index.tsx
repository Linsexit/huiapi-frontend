import {PageContainer} from '@ant-design/pro-components';
import {List, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {listInterfaceInfoByPageUsingGet} from "@/services/huiapi-backend/interfaceInfoController";


/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const pSize = 5;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = 1, pageSize = pSize) => {
    setLoading(true);

    try {
      const res = await listInterfaceInfoByPageUsingGet({
        current,
        pageSize
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);


  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <PageContainer title="在线接口开放平台">
      <List
        className="interface-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;

          return (
            <List.Item
              actions={[<a key={item.id} href={apiLink} >查看</a>]}
            >
              <List.Item.Meta
                title={<a href={apiLink} >{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        }
        pagination={
          {
            pageSize: pSize,
            total,
            onChange(page,pageSize) {
              loadData(page, pageSize)
            },
            showTotal(total) {
              return '总数：' + total;
            },
          }
        }
      />
    </PageContainer>
  );
};

export default Index;
