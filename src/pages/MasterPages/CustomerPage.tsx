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
import useCustomerService from '../../hooks/custom/useCustomerService';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import Swal from 'sweetalert2';
import { BaseDatePicker } from '@app/components/common/pickers/BaseDatePicker';
import { BaseCollapse } from '@app/components/common/BaseCollapse/BaseCollapse';
import moment from 'moment';
import dayjs from 'dayjs';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

const CustomerPage: React.FC = () => {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState(0);
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const { Panel } = BaseCollapse;
  const [form] = BaseForm.useForm();

  const { getAllAction, getByIdAction, deleteAction, saveDataAction } = useCustomerService();

  useEffect(() => {
    getAll();
  }, []);

  const addCustomer = () => {
    setIsBasicModalOpen(true);
    setCustomerId(0);
  };

  const getAll = async () => {
    let data = await getAllAction();
    setTableData({ data: data, loading: false });
  };

  const handleEditRow = async (record: any) => {
    setCustomerId(record.Id);
    let customer = await getByIdAction({ customerId: record.Id });
    form.setFieldsValue({
      firstName: customer.FirstName,
      lastName: customer.LastName,
      email: customer.Email,
      password: customer.Password,
      phone: customer.Phone,
      address1: customer.Address1,
      address2: customer.Address2,
      country: customer.Country,
      state: customer.State,
      city: customer.City,
      postalCode: customer.PostalCode,
      billingAddress: customer.BillingAddress,
      billingCountry: customer.BillingCountry,
      billingState: customer.BillingState,
      billingCity: customer.BillingCity,
      billingPostalCode: customer.BillingPostalCode,
      shipAddress: customer.ShipAddress,
      shipCountry: customer.ShipCountry,
      shipState: customer.ShipState,
      shipCity: customer.ShipCity,
      shipPostalCode: customer.ShipPostalCode,
    });
    setIsBasicModalOpen(true);
  };

  const handleDeleteRow = async (id: number) => {
    Swal.fire({
      html: 'Are you sure you want to delete this Customer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await deleteAction({ customerId: id });
        getAll();
        notificationController.success({ message: 'Customer deleted successfully' });
      }
    });
  };

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'First Name',
      dataIndex: 'FirstName',
      sorter: (a: any, b: any) => a.FirstName - b.FirstName,
      showSorterTooltip: false,
    },
    {
      title: 'Last Name',
      dataIndex: 'LastName',
      sorter: (a: any, b: any) => a.LastName - b.LastName,
      showSorterTooltip: false,
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: 'Password',
      dataIndex: 'Password',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
    },
    {
      title: 'Created Date',
      dataIndex: 'CreatedDate',
      render: (text: string) => (
        <>
          <span>{moment(text).format('YYYY-MM-DD')}</span>
        </>
      ),
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

  const onFinish = async (customer: any) => {
    let reqObj: any = {
      FirstName: customer.firstName,
      LastName: customer.lastName,
      Email: customer.email,
      Password: customer.password,
      Phone: customer.phone,
      Address1: customer.address1,
      Address2: customer.address2,
      Country: customer.country,
      State: customer.state,
      City: customer.city,
      PostalCode: customer.postalCode,
      BillingAddress: customer.billingAddress,
      BillingCountry: customer.billingCountry,
      BillingState: customer.billingState,
      BillingCity: customer.billingCity,
      BillingPostalCode: customer.billingPostalCode,
      ShipAddress: customer.shipAddress,
      ShipCountry: customer.shipCountry,
      ShipState: customer.shipState,
      ShipCity: customer.shipCity,
      ShipPostalCode: customer.shipPostalCode,
      Active: 1,
      Id: customerId,
    };

    await saveDataAction(reqObj);

    await getAll();

    form.resetFields();
    setCustomerId(0);
    setIsBasicModalOpen(false);

    if (customerId === 0) notificationController.success({ message: 'Customer created successfully' });
    else notificationController.success({ message: 'Customer updated successfully' });
  };

  return (
    <>
      <BaseCard title="Customer" padding="1.25rem">
        <BaseRow>
          <BaseCol xl={24} offset={21}>
            <BaseButton type="ghost" name="addCustomer" onClick={addCustomer}>
              Add Customer
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
        title={customerId ? 'Edit Customer' : 'Add Customer'}
        open={isBasicModalOpen}
        okText="Submit"
        onOk={form.submit}
        onCancel={() => setIsBasicModalOpen(false)}
        size="large"
      >
        <BaseForm form={form} layout="vertical" name="addCustomerForm" onFinish={onFinish}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <BaseForm.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'First Name is required' }]}
              style={{ width: '50%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
            <BaseForm.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Last Name is required' }]}
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
              style={{ width: '33.33%' }}
            >
              <BaseInput maxLength={500} />
            </BaseForm.Item>
            <BaseForm.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Phone is required' }]}
              style={{ width: '33.33%' }}
            >
              <BaseInput maxLength={15} />
            </BaseForm.Item>
            <BaseForm.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
              style={{ width: '33.33%' }}
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
          <BaseCollapse>
            <Panel header="Billing" key="1">
              <BaseForm.Item
                name="billingAddress"
                label="BillingAddress"
                rules={[{ required: true, message: 'Billing Address is required' }]}
              >
                <BaseInput maxLength={500} size="large" />
              </BaseForm.Item>
              <div style={{ display: 'flex', gap: '20px' }}>
                <BaseForm.Item
                  name="billingCountry"
                  label="BillingCountry"
                  rules={[{ required: true, message: 'Billing Country is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={500} />
                </BaseForm.Item>
                <BaseForm.Item
                  name="billingState"
                  label="BillingState"
                  rules={[{ required: true, message: 'Billing State is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={500} />
                </BaseForm.Item>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <BaseForm.Item
                  name="billingCity"
                  label="BillingCity"
                  rules={[{ required: true, message: 'Billing City is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={500} />
                </BaseForm.Item>
                <BaseForm.Item
                  name="billingPostalCode"
                  label="Billing Postal Code"
                  rules={[{ required: true, message: 'Billing Postal Code is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={50} />
                </BaseForm.Item>
              </div>
            </Panel>
          </BaseCollapse>
          <BaseCollapse style={{ margin: '20px 0px' }}>
            <Panel header="Shipping" key="1">
              <BaseForm.Item
                name="shipAddress"
                label="ShipAddress"
                rules={[{ required: true, message: 'Ship Address is required' }]}
              >
                <BaseInput maxLength={500} size="large" />
              </BaseForm.Item>
              <div style={{ display: 'flex', gap: '20px' }}>
                <BaseForm.Item
                  name="shipCountry"
                  label="ShipCountry"
                  rules={[{ required: true, message: 'Ship Country is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={500} />
                </BaseForm.Item>
                <BaseForm.Item
                  name="shipState"
                  label="ShipState"
                  rules={[{ required: true, message: 'Ship State is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={500} />
                </BaseForm.Item>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <BaseForm.Item
                  name="shipCity"
                  label="ShipCity"
                  rules={[{ required: true, message: 'Ship City is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={500} />
                </BaseForm.Item>
                <BaseForm.Item
                  name="shipPostalCode"
                  label="Ship Postal Code"
                  rules={[{ required: true, message: 'Ship Postal Code is required' }]}
                  style={{ width: '50%' }}
                >
                  <BaseInput maxLength={50} />
                </BaseForm.Item>
              </div>
            </Panel>
          </BaseCollapse>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default CustomerPage;
