// "use client";
// import { useState, useEffect } from "react";
// import { Button, Input, Modal, Table, Pagination, SelectPicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "./hooks/axios";
// import { FaEdit, FaTrashAlt, FaPlus, FaFilePdf } from "react-icons/fa";
// import moment from "moment";

// const statusOptions = [
//   { label: "Pending", value: "Pending" },
//   { label: "Shipped", value: "Shipped" },
//   { label: "Delivered", value: "Delivered" },
//   { label: "Cancelled", value: "Cancelled" }
// ];

// export default function Home() {
//   const [orders, setOrders] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [newOrder, setNewOrder] = useState({ name: "", date: "", status: "Pending" });
//   const [editMode, setEditMode] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [report, setReport] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(3);

//   useEffect(() => {
//     axios
//       .get("/orders")
//       .then((response) => setOrders(response.data))
//       .catch(() => toast.error("Failed to fetch orders."));
//   }, []);

//   const handleAddOrder = async () => {
//     if (orders.find((order) => order.name === newOrder.name)) {
//       toast.error("Order already exists!");
//       return;
//     }
//     if (!newOrder.name || !newOrder.date || !newOrder.status) {
//       toast.error("All fields are required!");
//       return;
//     }
//     try {
//       await axios.post("/orders", newOrder);
//       toast.success("Order added successfully!");
//       setShowModal(false);
//       setNewOrder({ name: "", date: "", status: "Pending" });
//       const response = await axios.get("/orders");
//       setOrders(response.data);
//     } catch {
//       toast.error("Failed to add order.");
//     }
//   };

//   const handleUpdateOrder = async () => {
//     if (!newOrder.name || !newOrder.date || !newOrder.status) {
//       toast.error("All fields are required!");
//       return;
//     }
//     try {
//       await axios.put(`/orders/${currentOrder._id}`, newOrder);
//       toast.success("Order updated successfully!");
//       setShowModal(false);
//       setNewOrder({ name: "", date: "", status: "Pending" });
//       setEditMode(false);
//       const response = await axios.get("/orders");
//       setOrders(response.data);
//     } catch {
//       toast.error("Failed to update order.");
//     }
//   };

//   const handleDeleteOrder = async (id) => {
//     try {
//       await axios.delete(`/orders/${id}`);
//       toast.success("Order deleted successfully!");
//       const response = await axios.get("/orders");
//       setOrders(response.data);
//     } catch {
//       toast.error("Failed to delete order.");
//     }
//   };

//   const handleEditOrder = (order) => {
//     setNewOrder({ name: order.name, date: moment(order.date).format("YYYY-MM-DD"), status: order.status });
//     setCurrentOrder(order);
//     setEditMode(true);
//     setShowModal(true);
//   };

//   const handleGenerateReport = async () => {
//     try {
//       const response = await axios.get("/orders/report", { responseType: "blob" });
//       setReport(URL.createObjectURL(response.data));
//       toast.success("Report generated successfully!");
//     } catch {
//       toast.error("Failed to generate report.");
//     }
//   };

//   const filteredOrders = orders.filter((order) =>
//     order.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="container mx-auto p-6 max-w-7xl">
//       <ToastContainer />
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <Input
//           placeholder="Search orders..."
//           value={search}
//           onChange={(value) => setSearch(value)}
//           className="mb-4 md:mb-0 md:w-1/2"
//         />
//         <div className="flex gap-4">
//           <Button
//             onClick={() => {
//               setNewOrder({ name: "", date: "", status: "Pending" });
//               setEditMode(false);
//               setShowModal(true);
//             }}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <FaPlus className="mr-2" /> New Order
//           </Button>
//           <Button
//             onClick={handleGenerateReport}
//             className="bg-green-600 hover:bg-green-700 text-white"
//           >
//             <FaFilePdf className="mr-2" /> Report
//           </Button>
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <Table data={paginatedOrders} autoHeight bordered className="min-w-full">
//           <Table.Column width={200} align="center">
//             <Table.HeaderCell>Name</Table.HeaderCell>
//             <Table.Cell dataKey="name" />
//           </Table.Column>
//           <Table.Column width={200} align="center">
//             <Table.HeaderCell>Date</Table.HeaderCell>
//             <Table.Cell>
//               {(rowData) => moment(rowData.date).format("YYYY-MM-DD")}
//             </Table.Cell>
//           </Table.Column>
//           <Table.Column width={200} align="center">
//             <Table.HeaderCell>Status</Table.HeaderCell>
//             <Table.Cell dataKey="status" />
//           </Table.Column>
//           <Table.Column width={250} align="center">
//             <Table.HeaderCell>Action</Table.HeaderCell>
//             <Table.Cell>
//               {(rowData) => (
//                 <div className="flex justify-center gap-2">
//                   <Button
//                     onClick={() => handleEditOrder(rowData)}
//                     appearance="link"
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <FaEdit />
//                   </Button>
//                   <Button
//                     onClick={() => handleDeleteOrder(rowData._id)}
//                     appearance="link"
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <FaTrashAlt />
//                   </Button>
//                 </div>
//               )}
//             </Table.Cell>
//           </Table.Column>
//         </Table>
//       </div>
//       <Pagination
//         activePage={page}
//         total={filteredOrders.length}
//         limit={pageSize}
//         onChangePage={(page) => setPage(page)}
//         className="mt-4"
//       />
//       <Modal open={showModal} onClose={() => setShowModal(false)}>
//         <Modal.Header>
//           <Modal.Title>{editMode ? "Edit Order" : "New Order"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="space-y-4">
//             <Input
//               placeholder="Name"
//               value={newOrder.name}
//               onChange={(value) => setNewOrder((prev) => ({ ...prev, name: value }))}
//               className="w-full"
//               required
//             />
//             <Input
//               type="date"
//               value={newOrder.date}
//               onChange={(value) => setNewOrder((prev) => ({ ...prev, date: value }))}
//               className="w-full"
//               required
//             />
//             <SelectPicker
//               data={statusOptions}
//               value={newOrder.status}
//               onChange={(value) => setNewOrder((prev) => ({ ...prev, status: value }))}
//               className="w-full"
//               placeholder="Select Status"
//               searchable={false}
//               required
//             />
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             onClick={editMode ? handleUpdateOrder : handleAddOrder}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//             appearance="primary"
//           >
//             {editMode ? "Update" : "Add"}
//           </Button>
//           <Button
//             onClick={() => setShowModal(false)}
//             className="text-gray-500 hover:text-gray-700"
//             appearance="subtle"
//           >
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       {report && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Report</h2>
//           <iframe src={report} width="100%" height="600px" title="Report" className="border" />
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Table,
  Pagination,
  SelectPicker,
  Loader
} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "./hooks/axios";
import { FaEdit, FaTrashAlt, FaPlus, FaFilePdf } from "react-icons/fa";
import moment from "moment";

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" }
];

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    name: "",
    date: "",
    status: "Pending"
  });
  const [editMode, setEditMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [report, setReport] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);

  useEffect(() => {
    axios
      .get("/orders")
      .then((response) => {
        setOrders(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(() => {
        toast.error("Failed to fetch orders.");
        setLoading(false); // Stop loading even if there is an error
      });
  }, []);

  const handleAddOrder = async () => {
    if (orders.find((order) => order.name === newOrder.name)) {
      toast.error("Order already exists!");
      return;
    }
    if (!newOrder.name || !newOrder.date || !newOrder.status) {
      toast.error("All fields are required!");
      return;
    }
    try {
      await axios.post("/orders", newOrder);
      toast.success("Order added successfully!");
      setShowModal(false);
      setNewOrder({ name: "", date: "", status: "Pending" });
      const response = await axios.get("/orders");
      setOrders(response.data);
    } catch {
      toast.error("Failed to add order.");
    }
  };

  const handleUpdateOrder = async () => {
    if (!newOrder.name || !newOrder.date || !newOrder.status) {
      toast.error("All fields are required!");
      return;
    }
    try {
      await axios.put(`/orders/${currentOrder._id}`, newOrder);
      toast.success("Order updated successfully!");
      setShowModal(false);
      setNewOrder({ name: "", date: "", status: "Pending" });
      setEditMode(false);
      const response = await axios.get("/orders");
      setOrders(response.data);
    } catch {
      toast.error("Failed to update order.");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`/orders/${id}`);
      toast.success("Order deleted successfully!");
      const response = await axios.get("/orders");
      setOrders(response.data);
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  const handleEditOrder = (order) => {
    setNewOrder({
      name: order.name,
      date: moment(order.date).format("YYYY-MM-DD"),
      status: order.status
    });
    setCurrentOrder(order);
    setEditMode(true);
    setShowModal(true);
  };

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("/orders/report", {
        responseType: "blob"
      });
      setReport(URL.createObjectURL(response.data));
      toast.success("Report generated successfully!");
    } catch {
      toast.error("Failed to generate report.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(value) => setSearch(value)}
          className="mb-4 md:mb-0 md:w-1/2"
        />
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setNewOrder({ name: "", date: "", status: "Pending" });
              setEditMode(false);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FaPlus className="mr-2" /> New Order
          </Button>
          <Button
            onClick={handleGenerateReport}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FaFilePdf className="mr-2" /> Report
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" content="Loading..." />
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>No orders found.</p>
          </div>
        ) : (
          <Table
            data={paginatedOrders}
            autoHeight
            bordered
            className="min-w-full"
          >
            <Table.Column width={100} align="center">
              <Table.HeaderCell>SL</Table.HeaderCell>
              <Table.Cell>
                {(rowData, rowIndex) => (page - 1) * pageSize + rowIndex + 1}
              </Table.Cell>
            </Table.Column>
            <Table.Column width={200} align="center">
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.Cell dataKey="name" />
            </Table.Column>
            <Table.Column width={200} align="center">
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.Cell>
                {(rowData) => moment(rowData.date).format("YYYY-MM-DD")}
              </Table.Cell>
            </Table.Column>
            <Table.Column width={200} align="center">
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.Cell dataKey="status" />
            </Table.Column>
            <Table.Column width={250} align="center">
              <Table.HeaderCell>Action</Table.HeaderCell>
              <Table.Cell>
                {(rowData) => (
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => handleEditOrder(rowData)}
                      appearance="link"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => handleDeleteOrder(rowData._id)}
                      appearance="link"
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                )}
              </Table.Cell>
            </Table.Column>
          </Table>
        )}
      </div>
      <Pagination
        activePage={page}
        total={filteredOrders.length}
        limit={pageSize}
        onChangePage={(page) => setPage(page)}
        className="mt-4"
      />
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>{editMode ? "Edit Order" : "New Order"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={newOrder.name}
              onChange={(value) =>
                setNewOrder((prev) => ({ ...prev, name: value }))
              }
              className="w-full"
              required
            />
            <Input
              type="date"
              value={newOrder.date}
              onChange={(value) =>
                setNewOrder((prev) => ({ ...prev, date: value }))
              }
              className="w-full"
              required
            />
            <SelectPicker
              data={statusOptions}
              value={newOrder.status}
              onChange={(value) =>
                setNewOrder((prev) => ({ ...prev, status: value }))
              }
              className="w-full"
              placeholder="Select Status"
              searchable={false}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={editMode ? handleUpdateOrder : handleAddOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            appearance="primary"
          >
            {editMode ? "Update" : "Add"}
          </Button>
          <Button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
            appearance="subtle"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {report && (
        <div className="mt-6">
          <iframe src={report} width="100%" height="600px" title="Report" />
        </div>
      )}
    </div>
  );
}
