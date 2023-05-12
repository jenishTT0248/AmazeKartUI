import React, { useEffect, useState } from 'react';
import { BasicTableRow, Pagination } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { notificationController } from 'controllers/notificationController';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useSupplierService from '../../hooks/custom/useSupplierService';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import Swal from 'sweetalert2';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

const SupplierPage: React.FC = () => {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState<boolean>(false);
  const [supplierId, setSupplierId] = useState(0);
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const { getAllAction, getByIdAction, deleteAction, saveDataAction } = useSupplierService();

  useEffect(() => {
    getAll();
  }, []);

  const addSupplier = () => {
    setIsBasicModalOpen(true);
    setSupplierId(0);
  };

  const getAll = async () => {
    let data = await getAllAction();
    setTableData({ data: data, loading: false });
  };

  const handleEditRow = async (record: any) => {
    setSupplierId(record.Id);
    let supplier = await getByIdAction({ supplierId: record.Id });
    form.setFieldsValue({
      companyName: supplier.CompanyName,
      contactFirstName: supplier.ContactFirstName,
      contactLastName: supplier.ContactLastName,
      email: supplier.Email,
      phone: supplier.Phone,
      address1: supplier.Address1,
      address2: supplier.Address2,
      country: supplier.Country,
      state: supplier.State,
      city: supplier.City,
      postalCode: supplier.PostalCode,
    });
    setIsBasicModalOpen(true);
  };

  const handleDeleteRow = async (id: number) => {
    Swal.fire({
      html: 'Are you sure you want to delete this Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await deleteAction({ supplierId: id });
        getAll();
        notificationController.success({ message: 'Supplier deleted successfully' });
      }
    });
  };

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'Company Name',
      dataIndex: 'CompanyName',
      sorter: (a: any, b: any) => a.CategoryName - b.CategoryName,
      showSorterTooltip: false,
    },
    {
      title: 'Contact First Name',
      dataIndex: 'ContactFirstName',
      sorter: (a: any, b: any) => a.ContactFirstName - b.ContactFirstName,
      showSorterTooltip: false,
    },
    {
      title: 'Contact Last Name',
      dataIndex: 'ContactLastName',
      sorter: (a: any, b: any) => a.ContactLastName - b.ContactLastName,
      showSorterTooltip: false,
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: any) => {
        return (
          <BaseSpace>
            <BaseButton type="ghost" onClick={() => handleEditRow(record)}>
              <EditOutlined key={`Edit_${record.Id}`} />
            </BaseButton>

            <BaseButton type="default" danger onClick={() => handleDeleteRow(record.Id)}>
              <DeleteOutlined key={`Delete_${record.Id}`} />
            </BaseButton>
          </BaseSpace>
        );
      },
    },
  ];

  const [form] = BaseForm.useForm();

  const onFinish = async (supplier: any) => {
    let reqObj: any = {
      CompanyName: supplier.companyName,
      ContactFirstName: supplier.contactFirstName,
      ContactLastName: supplier.contactLastName,
      Email: supplier.email,
      Phone: supplier.phone,
      Address1: supplier.address1,
      Address2: supplier.address2,
      Country: supplier.country,
      State: supplier.state,
      City: supplier.city,
      PostalCode: supplier.postalCode,
      Active: 1,
      Id: supplierId,
    };

    await saveDataAction(reqObj);

    await getAll();

    form.resetFields();
    setSupplierId(0);
    setIsBasicModalOpen(false);

    if (supplierId === 0) notificationController.success({ message: 'Supplier created successfully' });
    else notificationController.success({ message: 'Supplier updated successfully' });
  };

  return (
    <>
      <BaseCard title="Supplier" padding="1.25rem">
        <BaseRow>
          <BaseCol xl={24} offset={21}>
            <BaseButton type="ghost" name="addSupplier" onClick={addSupplier}>
              Add Supplier
            </BaseButton>
          </BaseCol>
        </BaseRow>

        <BaseRow style={{ paddingTop: '15px' }}>
          <BaseCol xl={24}>
            <BaseTable
              columns={columns}
              dataSource={tableData.data}
              pagination={initialPagination}
              loading={tableData.loading}
              scroll={{ x: 800 }}
              bordered
              rowKey="Id"
            />
          </BaseCol>
        </BaseRow>
      </BaseCard>

      <BaseModal
        title={supplierId ? 'Edit Supplier' : 'Add Supplier'}
        open={isBasicModalOpen}
        okText="Submit"
        onOk={form.submit}
        onCancel={() => setIsBasicModalOpen(false)}
        size="large"
      >
        <BaseForm form={form} layout="vertical" name="addSupplierForm" onFinish={onFinish}>
          <BaseForm.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Company Name is required' }]}
          >
            <BaseInput maxLength={500} />
          </BaseForm.Item>
          <div style={{ display: 'flex', gap: '20px' }}>
            <BaseForm.Item
              name="contactFirstName"
              label="Contact First Name"
              rules={[{ required: true, message: 'Contact First Name is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
            <BaseForm.Item
              name="contactLastName"
              label="Contact Last Name"
              rules={[{ required: true, message: 'Contact Last Name is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <BaseForm.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Email is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
            <BaseForm.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Phone is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={15} />
            </BaseForm.Item>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <BaseForm.Item
              name="address1"
              label="Address1"
              rules={[{ required: true, message: 'Address1 is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} size="large" />
            </BaseForm.Item>
            <BaseForm.Item
              name="address2"
              label="Address2"
              rules={[{ required: true, message: 'Address2 is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} size="large" />
            </BaseForm.Item>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <BaseForm.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Country is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
            <BaseForm.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'State is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <BaseForm.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'City is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
            <BaseForm.Item
              name="postalCode"
              label="Postal Code"
              rules={[{ required: true, message: 'Postal Code is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={50} />
            </BaseForm.Item>
          </div>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default SupplierPage;
