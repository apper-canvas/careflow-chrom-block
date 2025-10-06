import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import PatientFormModal from "@/components/organisms/PatientFormModal";
import patientService from "@/services/api/patientService";
import { format } from "date-fns";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = patients.filter(patient =>
      patient.firstName.toLowerCase().includes(lowerQuery) ||
      patient.lastName.toLowerCase().includes(lowerQuery) ||
      patient.email.toLowerCase().includes(lowerQuery) ||
      patient.phone.includes(query)
    );
    setFilteredPatients(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      await patientService.delete(id);
      toast.success("Patient deleted successfully");
      loadPatients();
    } catch (err) {
      toast.error(err.message || "Failed to delete patient");
    }
  };

  const columns = [
    {
      header: "Patient",
      accessor: "name",
      render: (patient) => (
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-2">
            <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
            <p className="text-sm text-gray-600">{patient.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: "phone",
      render: (patient) => (
        <div>
          <p className="text-sm text-gray-900">{patient.phone}</p>
        </div>
      )
    },
    {
      header: "Blood Group",
      accessor: "bloodGroup",
      render: (patient) => (
        <Badge variant="primary">{patient.bloodGroup}</Badge>
      )
    },
    {
      header: "Department",
      accessor: "currentDepartment",
      render: (patient) => (
        <span className="text-sm text-gray-900">{patient.currentDepartment}</span>
      )
    },
    {
      header: "Admission Date",
      accessor: "admissionDate",
      render: (patient) => (
        <span className="text-sm text-gray-600">
          {format(new Date(patient.admissionDate), "MMM dd, yyyy")}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (patient) => (
        <Badge variant={patient.status === "Active" ? "success" : "warning"}>
          {patient.status}
        </Badge>
      )
    }
  ];

  if (loading) return <Loading rows={8} />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <ApperIcon name="UserPlus" size={20} className="mr-2" />
          Register Patient
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <SearchBar 
            placeholder="Search patients by name, email, or phone..." 
            onSearch={handleSearch}
            className="max-w-md"
          />
        </div>

        {filteredPatients.length === 0 ? (
          searchQuery ? (
            <Empty 
              icon="Search" 
              title="No Patients Found" 
              description="No patients match your search criteria. Try different keywords."
            />
          ) : (
            <Empty 
              icon="Users" 
              title="No Patients Yet" 
              description="Start by registering your first patient to the system."
              action={() => setShowModal(true)}
              actionLabel="Register First Patient"
            />
          )
        ) : (
          <DataTable
            columns={columns}
            data={filteredPatients}
            onRowClick={(patient) => navigate(`/patients/${patient.Id}`)}
            actions={(patient) => (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/patients/${patient.Id}`);
                  }}
                >
                  <ApperIcon name="Eye" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(patient.Id);
                  }}
                >
                  <ApperIcon name="Trash2" size={16} className="text-red-600" />
                </Button>
              </>
            )}
          />
        )}
      </Card>

      {showModal && (
        <PatientFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadPatients();
          }}
        />
      )}
    </div>
  );
};

export default Patients;