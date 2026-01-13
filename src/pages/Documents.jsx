import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, Trash2, Download, Eye, Plus, 
  Calendar, CheckCircle, AlertTriangle, File
} from 'lucide-react'
import { Navbar, Footer } from '../components/navigation'
import { Card, Button, Modal, EmptyState, Badge } from '../components/ui'
import { useStore } from '../lib/store'
import { uploadDocument, deleteDocument } from '../lib/database'

const documentTypes = [
  { id: 'elevation_cert', label: 'Elevation Certificate', icon: '📋', required: true },
  { id: 'insurance_policy', label: 'Insurance Policy', icon: '🛡️', required: true },
  { id: 'appraisal', label: 'Property Appraisal', icon: '💰', required: false },
  { id: 'permits', label: 'Building Permits', icon: '📄', required: false },
  { id: 'flood_zone', label: 'Flood Zone Determination', icon: '🌊', required: false },
  { id: 'inspection', label: 'Inspection Reports', icon: '🔍', required: false },
  { id: 'contractor_quotes', label: 'Contractor Quotes', icon: '🔧', required: false },
  { id: 'other', label: 'Other Documents', icon: '📁', required: false },
]

export default function DocumentsPage() {
  const { documents, currentPropertyId } = useStore()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const propertyDocs = documents.filter(d => d.property_id === currentPropertyId)

  const handleUploadClick = (type) => {
    setSelectedType(type)
    setUploadModalOpen(true)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !selectedType) return

    setUploading(true)
    await uploadDocument(file, currentPropertyId, selectedType.id)
    setUploading(false)
    setUploadModalOpen(false)
    setSelectedType(null)
  }

  const handleDelete = async (doc) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(doc.id, doc.path)
    }
  }

  const getDocsByType = (typeId) => propertyDocs.filter(d => d.type === typeId)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Document Vault</h1>
          <p className="text-slate-400">
            Store and manage all your property resilience documents in one secure place.
          </p>
        </div>

        {/* Document Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.map((type) => {
            const docs = getDocsByType(type.id)
            const hasDoc = docs.length > 0
            
            return (
              <Card key={type.id} className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-100">{type.label}</h3>
                      {type.required && (
                        <Badge color={hasDoc ? 'emerald' : 'amber'} size="sm">
                          {hasDoc ? 'Complete' : 'Required'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {hasDoc ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : type.required ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : null}
                </div>

                {docs.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {docs.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-300 truncate">
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button 
                            onClick={() => window.open(doc.url, '_blank')}
                            className="p-1 hover:bg-slate-600 rounded"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc)}
                            className="p-1 hover:bg-slate-600 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mb-4">No documents uploaded</p>
                )}

                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleUploadClick(type)}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {hasDoc ? 'Add Another' : 'Upload'}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* Tips Card */}
        <Card className="mt-8 bg-blue-900/30 border-blue-500/30">
          <h3 className="font-bold text-slate-100 mb-2">💡 Document Tips</h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• <strong>Elevation Certificate:</strong> Get a new one if you've made any elevation changes. Required for accurate flood insurance rating.</li>
            <li>• <strong>Insurance Policy:</strong> Upload your declarations page to track coverage and identify gaps.</li>
            <li>• <strong>Pre-Improvement Appraisal:</strong> Essential before major renovations to establish baseline for 40% rule.</li>
          </ul>
        </Card>
      </main>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={`Upload ${selectedType?.label || 'Document'}`}
      >
        <div className="text-center">
          <div 
            className="border-2 border-dashed border-slate-600 rounded-xl p-8 hover:border-emerald-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">
              Click to select a file or drag and drop
            </p>
            <p className="text-sm text-slate-500">
              PDF, JPG, or PNG up to 10MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="mt-6 flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setUploadModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              className="flex-1"
            >
              Select File
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
