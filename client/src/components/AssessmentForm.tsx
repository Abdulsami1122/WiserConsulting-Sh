"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { 
  submitAssessmentForm, 
  clearError, 
  clearSuccess,
  resetFormSubmission 
} from "@/redux/slices/formSubmission/formSubmissionSlice";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Upload, 
  FileText, 
  User, 
  Plane, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Loader2
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  destinationCountry: string;
  otherCountry: string;
  visaType: string;
  fromDate: string;
  toDate: string;
  purpose: string;
  passports: File[];
  businessBankStatement: File[];
  personalBankStatement: File[];
  businessRegistration: File[];
  taxpayerCertificate: File[];
  incomeTaxReturns: File[];
  propertyDocuments: File[];
  frcFamily: File[];
  frcParents: File[];
  marriageCertificate: File[];
  invitationLetter: File[];
  flightReservation: File[];
  hotelReservation: File[];
  anyOtherDocuments: File[];
  coverLetter: File[];
}

const AssessmentForm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isSubmitting, error, success } = useSelector((state: RootState) => state.formSubmission);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    destinationCountry: "",
    otherCountry: "",
    visaType: "",
    fromDate: "",
    toDate: "",
    purpose: "",
    passports: [],
    businessBankStatement: [],
    personalBankStatement: [],
    businessRegistration: [],
    taxpayerCertificate: [],
    incomeTaxReturns: [],
    propertyDocuments: [],
    frcFamily: [],
    frcParents: [],
    marriageCertificate: [],
    invitationLetter: [],
    flightReservation: [],
    hotelReservation: [],
    anyOtherDocuments: [],
    coverLetter: [],
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    let successTimeout: NodeJS.Timeout | null = null;
    let errorTimeout: NodeJS.Timeout | null = null;

    if (success) {
      setNotification({ type: 'success', message: success });
      successTimeout = setTimeout(() => {
        setNotification(null);
        dispatch(clearSuccess());
        onClose();
      }, 3000);
    }
    if (error) {
      setNotification({ type: 'error', message: error });
      errorTimeout = setTimeout(() => {
        setNotification(null);
        dispatch(clearError());
      }, 5000);
    }

    return () => {
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [success, error, dispatch, onClose]);

  useEffect(() => {
    return () => {
      dispatch(resetFormSubmission());
    };
  }, [dispatch]);

  const countries = [
    "United Kingdom",
    "United States",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Switzerland",
    "New Zealand",
    "Singapore",
    "Japan",
    "South Korea",
    "Other",
  ];

  const visaTypes = ["Tourist Visa", "Student Visa", "Transit Visa"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        const errors: string[] = [];
        const validFiles = filesArray.filter(file => {
          if (file.size > maxSize) {
            errors.push(`File "${file.name}" is too large. Maximum size is 10MB.`);
            return false;
          }
          
          if (!allowedTypes.includes(file.type)) {
            errors.push(`File "${file.name}" is not a supported type.`);
            return false;
          }
          
          return true;
        });

        if (errors.length > 0) {
          const errorMessage = errors.length === 1 
            ? errors[0] 
            : `Multiple files failed validation:\n${errors.map((err, idx) => `${idx + 1}. ${err}`).join('\n')}`;
          setNotification({ type: 'error', message: errorMessage });
        }
        
        if (validFiles.length > 0) {
          setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] as File[]), ...validFiles],
          }));
        }
      }
    };

  const removeFile = (field: keyof FormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as File[]).filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(formData.name && formData.email && formData.phone);
    }
    if (step === 2) {
      return !!(formData.destinationCountry && formData.visaType && formData.fromDate && formData.toDate && formData.purpose);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      setNotification({ type: 'error', message: 'Please fill all required fields before submitting.' });
      setCurrentStep(2);
      return;
    }
    
    await dispatch(submitAssessmentForm(formData));
  };

  if (!isOpen) return null;

  const FileUpload = ({ label, field }: { label: string; field: keyof FormData }) => {
    const files = formData[field] as File[];
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-800">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-500 hover:bg-slate-50 transition-all group">
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-slate-600 mb-2" />
          <span className="text-sm text-slate-600 font-medium">Click or drag files here</span>
          <span className="text-xs text-slate-400 mt-1">PDF, Images, or Word docs (Max 10MB)</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange(field)}
          />
        </label>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((file, idx) => (
              <div key={idx} className="relative group">
                <div className="w-24 h-24 border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50 hover:border-slate-400 transition-colors">
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => setPreviewImage(URL.createObjectURL(file))}
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full p-2">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(field, idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-white text-[10px] p-1 truncate">
                  {file.name.length > 15 ? file.name.slice(0, 12) + "..." : file.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const steps = [
    { number: 1, label: "Personal Info", icon: <User className="w-5 h-5" /> },
    { number: 2, label: "Travel Details", icon: <Plane className="w-5 h-5" /> },
    { number: 3, label: "Documents", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-8 py-6 flex justify-between items-center border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold mb-1">Free Visa Assessment</h2>
            <p className="text-sm text-slate-300">Complete the form to get started</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.number
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-400 border-2 border-slate-300"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium hidden sm:block ${
                    currentStep >= step.number ? "text-slate-900" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? "bg-slate-900" : "bg-slate-300"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mx-8 mt-6 p-4 rounded-lg flex items-center gap-3 ${
                notification.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} id="assessment-form" className="flex flex-col flex-1">
          {/* Form Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {user && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Logged in as {user.name}</p>
                      <p className="text-xs text-slate-600">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      readOnly={!!user}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900 disabled:bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      readOnly={!!user}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900 disabled:bg-slate-50"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Travel Info */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Destination Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Visa Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="visaType"
                      value={formData.visaType}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      required
                    >
                      <option value="">Select visa type</option>
                      {visaTypes.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Travel From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Travel To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      required
                    />
                  </div>
                  {formData.destinationCountry === "Other" && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Specify Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherCountry"
                        placeholder="Enter country name"
                        value={formData.otherCountry}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                        required
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Purpose of Travel <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="purpose"
                      placeholder="Describe the purpose of your travel..."
                      value={formData.purpose}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900 resize-none"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && formData.visaType && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Please upload all required documents. Supported formats: PDF, Images (JPG, PNG), Word documents. Maximum file size: 10MB per file.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload label="Passports (New & Old)" field="passports" />
                  <FileUpload label="Business Bank Statement" field="businessBankStatement" />
                  <FileUpload label="Personal Bank Statement" field="personalBankStatement" />
                  <FileUpload label="Business Registration" field="businessRegistration" />
                  <FileUpload label="Taxpayer Certificate" field="taxpayerCertificate" />
                  <FileUpload label="Income Tax Returns" field="incomeTaxReturns" />
                  <FileUpload label="Property Documents" field="propertyDocuments" />
                  <FileUpload label="FRC (Family)" field="frcFamily" />
                  <FileUpload label="FRC (Parents)" field="frcParents" />
                  <FileUpload label="Marriage Certificate" field="marriageCertificate" />
                  <FileUpload label="Invitation Letter" field="invitationLetter" />
                  <FileUpload label="Flight Reservation" field="flightReservation" />
                  <FileUpload label="Hotel Reservation" field="hotelReservation" />
                  <FileUpload label="Other Documents" field="anyOtherDocuments" />
                  <FileUpload label="Cover Letter" field="coverLetter" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-white transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      setNotification({ type: 'error', message: 'Please fill all required fields.' });
                    }
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Assessment
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-5xl w-full h-full flex items-center">
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
              unoptimized
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
