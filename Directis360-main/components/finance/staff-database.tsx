"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Users, Search, Phone, Mail, Eye, User, MapPin, Building } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface StaffMember {
  id: string
  name: string
  position: string
  department: string
  phone: string
  email: string
  address: string
  emergencyContact: string
  notes: string
  addedDate: string
}

interface StaffDatabaseProps {
  staffMembers: StaffMember[]
  setStaffMembers: (staff: StaffMember[]) => void
}

export default function StaffDatabase({ staffMembers, setStaffMembers }: StaffDatabaseProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { t, isRTL } = useLanguage()

  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    notes: "",
  })

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const staffData: StaffMember = {
      id: editingStaff?.id || Date.now().toString(),
      name: formData.name,
      position: formData.position,
      department: formData.department,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      notes: formData.notes,
      addedDate: editingStaff?.addedDate || new Date().toISOString().split("T")[0],
    }

    if (editingStaff) {
      setStaffMembers(staffMembers.map((staff) => (staff.id === editingStaff.id ? staffData : staff)))
    } else {
      setStaffMembers([...staffMembers, staffData])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      department: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      notes: "",
    })
    setEditingStaff(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff)
    setFormData({
      name: staff.name,
      position: staff.position,
      department: staff.department,
      phone: staff.phone,
      email: staff.email,
      address: staff.address,
      emergencyContact: staff.emergencyContact,
      notes: staff.notes,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaffMembers(staffMembers.filter((staff) => staff.id !== id))
    }
  }

  const handleView = (staff: StaffMember) => {
    setViewingStaff(staff)
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
    setViewingStaff(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t.staffdb_title}</CardTitle>
              <CardDescription>
                {t.staffdb_description}
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.staffdb_add_btn}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingStaff ? t.staffdb_edit_title : t.staffdb_add_new_title}</DialogTitle>
                  <DialogDescription>
                    {editingStaff ? t.staffdb_edit_description : t.staffdb_add_description}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.staffdb_label_fullname}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">{t.staffdb_label_position}</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">{t.staffdb_label_department}</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.staffdb_label_phone}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t.staffdb_label_email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">{t.staffdb_label_address}</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t.staffdb_placeholder_address}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContact">{t.staffdb_label_emergency}</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder={t.staffdb_placeholder_emergency}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">{t.staffdb_label_notes}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={t.staffdb_placeholder_notes}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingStaff ? t.staffdb_btn_update_member : t.staffdb_btn_add_member}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      {t.staffdb_btn_cancel}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Staff Grid */}
          {filteredStaff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((staff) => (
                <div key={staff.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{staff.name}</h3>
                        <p className="text-sm text-gray-500">{staff.position}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{staff.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{staff.email}</span>
                    </div>
                    {staff.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{staff.address}</span>
                      </div>
                    )}
                    {staff.emergencyContact && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="truncate">{t.staffdb_emergency_label_prefix} {staff.emergencyContact}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-400">{t.staffdb_added_label} {staff.addedDate}</div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleView(staff)} className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      {t.staffdb_btn_view}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(staff)} className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      {t.staffdb_btn_edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(staff.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.staffdb_no_staff_title}</h3>
              <p className="text-gray-500 mb-4">
                {staffMembers.length === 0
                  ? t.staffdb_no_staff_add_text
                  : t.staffdb_no_staff_search_text}
              </p>
              {staffMembers.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.staffdb_add_first_btn}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {staffMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.staffdb_total_staff}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffMembers.length}</div>
              <p className="text-xs text-muted-foreground">{t.staffdb_total_staff_desc}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.staffdb_departments}</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{[...new Set(staffMembers.map((s) => s.department))].length}</div>
              <p className="text-xs text-muted-foreground">{t.staffdb_departments_desc}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.staffdb_recent_additions}</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  staffMembers.filter((s) => {
                    const addedDate = new Date(s.addedDate)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return addedDate >= weekAgo
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">{t.staffdb_recent_additions_desc}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Staff Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.staffdb_view_title}</DialogTitle>
            <DialogDescription>{t.staffdb_view_description_prefix} {viewingStaff?.name}</DialogDescription>
          </DialogHeader>

          {viewingStaff && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{t.staffdb_section_basic}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_fullname} </Label>
                    <p className="text-sm">{viewingStaff.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_position} </Label>
                    <p className="text-sm">{viewingStaff.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_department} </Label>
                    <p className="text-sm">{viewingStaff.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_added_date} </Label>
                    <p className="text-sm">{viewingStaff.addedDate}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{t.staffdb_section_contact} </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_phone} </Label>
                    <p className="text-sm">{viewingStaff.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_email} </Label>
                    <p className="text-sm">{viewingStaff.email}</p>
                  </div>
                  {viewingStaff.address && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_address} </Label>
                      <p className="text-sm">{viewingStaff.address}</p>
                    </div>
                  )}
                  {viewingStaff.emergencyContact && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">{t.staffdb_field_emergency} </Label>
                      <p className="text-sm">{viewingStaff.emergencyContact}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {viewingStaff.notes && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">{t.staffdb_section_additional} </h3>
                  <p className="text-sm text-gray-600">{viewingStaff.notes}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleCloseViewDialog} className="flex-1 bg-transparent">
              {t.staffdb_btn_close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
