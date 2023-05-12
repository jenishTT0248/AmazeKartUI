import React, { useEffect, useState, useCallback } from 'react';
import { BasicTableRow, getBasicTableData, Pagination, Tag } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';


import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useCategoryService from "../../hooks/custom/useCategoryService";
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};


const CategoryPage: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [categories, setCategories] = useState<any>([]);
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const { getAllAction, getByIdAction, deleteAction, insertAction, updateAction } = useCategoryService();

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    let data = await getAllAction();
    setCategories(data);
    setTableData({ data: data, pagination: initialPagination, loading: false });
  }


  const [isBasicModalOpen, setIsBasicModalOpen] = useState<boolean>(false);



  const { t } = useTranslation();
  const { isMounted } = useMounted();

  // const fetch = useCallback(
  //   (pagination: Pagination) => {
  //     setTableData((tableData) => ({ ...tableData, loading: true }));
  //     getBasicTableData(pagination).then((res) => {
  //       if (isMounted.current) {
  //         setTableData({ data: res.data, pagination: res.pagination, loading: false });
  //       }
  //     });
  //   },
  //   [isMounted],
  // );

  // useEffect(() => {
  //   fetch(initialPagination);
  // }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    //fetch(pagination);
  };

  const handleEditRow = async (record: any) => {
    debugger
    setCategoryId(record.Id);
    var category = await getByIdAction({ categoryId: record.Id });
    form.setFieldsValue({ 'categoryName': category.CategoryName, 'description': category.Description });
    setIsBasicModalOpen(true);
  }

  const handleDeleteRow = async (categoryId: number) => {
    debugger;
    setLoading(true);
    await deleteAction({ categoryId: categoryId });
    setLoading(false);
  };

  const columns: ColumnsType<BasicTableRow> = [
    // {
    //   title: t('common.name'),
    //   dataIndex: 'name',
    //   render: (text: string) => <span>{text}</span>,
    //   filterMode: 'tree',
    //   filterSearch: true,
    //   filters: [
    //     {
    //       text: t('common.firstName'),
    //       value: 'firstName',
    //       children: [
    //         {
    //           text: 'Joe',
    //           value: 'Joe',
    //         },
    //         {
    //           text: 'Pavel',
    //           value: 'Pavel',
    //         },
    //         {
    //           text: 'Jim',
    //           value: 'Jim',
    //         },
    //         {
    //           text: 'Josh',
    //           value: 'Josh',
    //         },
    //       ],
    //     },
    //     {
    //       text: t('common.lastName'),
    //       value: 'lastName',
    //       children: [
    //         {
    //           text: 'Green',
    //           value: 'Green',
    //         },
    //         {
    //           text: 'Black',
    //           value: 'Black',
    //         },
    //         {
    //           text: 'Brown',
    //           value: 'Brown',
    //         },
    //       ],
    //     },
    //   ],
    //   onFilter: (value: string | number | boolean, record: BasicTableRow) => record.name.includes(value.toString()),
    // },
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.age - b.age,
      showSorterTooltip: false,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: any) => {
        return (
          <BaseSpace>

            <BaseButton
              type="ghost"
              onClick={() => handleEditRow(record)}
            >
              {/* notificationController.info({ message: t('tables.inviteMessage', { name: record.name }) }) */}
              <EditOutlined key={`Delete_${record.Id}`} />
            </BaseButton>

            <BaseButton type="default" danger onClick={() => handleDeleteRow(record.key)}>
              <DeleteOutlined key={`Delete_${record.Id}`} />
            </BaseButton>

          </BaseSpace>
        );
      },
    },
  ];


  const [form] = BaseForm.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    console.log(values);
    let reqObj: any = {
      CategoryName: values.categoryName,
      Description: values.description
    };

    if (categoryId > 0) {
      reqObj.Id = categoryId;
      await insertAction(reqObj);
    }
    else {
      await updateAction(reqObj);
    }

    await getAll();
    setLoading(false);

    form.resetFields();
    setCategoryId(0);
    setIsBasicModalOpen(false);
  };

  const addCategory = () => {
    setIsBasicModalOpen(true);
  }

  return (
    <>
      <BaseCard title='Categories' padding="1.25rem">

        <BaseRow >
          <BaseCol xl={24} offset={21}>
            <BaseButton type="ghost" name='addCategory' onClick={addCategory}>
              Add Category
            </BaseButton>
          </BaseCol>
        </BaseRow>

        <BaseRow style={{ paddingTop: "15px" }}>
          <BaseCol xl={24}>
            <BaseTable
              columns={columns}
              dataSource={tableData.data}
              pagination={tableData.pagination}
              loading={tableData.loading}
              onChange={handleTableChange}
              scroll={{ x: 800 }}
              bordered
            />
          </BaseCol>
        </BaseRow>

      </BaseCard>


      <BaseModal title="Add Category" open={isBasicModalOpen}
        onOk={form.submit}
        onCancel={() => setIsBasicModalOpen(false)}>
        <BaseForm form={form} layout="vertical" name="addCategoryForm"
          onFinish={onFinish}
        >
          <BaseForm.Item
            name="categoryName"
            label='Category Name'
            rules={[{ required: true, message: 'Category Name is required' }]}
          >
            <BaseInput maxLength={500} />
          </BaseForm.Item>
          <BaseForm.Item
            name="description"
            label='Description'
          >
            <BaseInput.TextArea rows={5} maxLength={4000} showCount />

          </BaseForm.Item>
        </BaseForm>
      </BaseModal>


    </>

  );
};

export default CategoryPage;