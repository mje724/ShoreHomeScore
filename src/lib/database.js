import { supabase, isDemoMode } from './supabase'
import { useStore } from './store'

// Property operations
export async function saveProperty(property) {
  if (isDemoMode) {
    // In demo mode, just use local storage via zustand
    const store = useStore.getState()
    if (property.id) {
      store.updateProperty(property.id, property)
    } else {
      const newProperty = {
        ...property,
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
      }
      store.addProperty(newProperty)
      return { data: newProperty, error: null }
    }
    return { data: property, error: null }
  }

  if (property.id && !property.id.startsWith('local-')) {
    // Update existing
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...property,
        updated_at: new Date().toISOString(),
      })
      .eq('id', property.id)
      .select()
      .single()
    
    if (!error) {
      useStore.getState().updateProperty(property.id, data)
    }
    return { data, error }
  } else {
    // Create new
    const user = useStore.getState().user
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...property,
        id: undefined, // Let Supabase generate ID
        user_id: user.id,
      })
      .select()
      .single()
    
    if (!error) {
      useStore.getState().addProperty(data)
    }
    return { data, error }
  }
}

export async function deleteProperty(propertyId) {
  if (isDemoMode || propertyId.startsWith('local-')) {
    useStore.getState().deleteProperty(propertyId)
    return { error: null }
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
  
  if (!error) {
    useStore.getState().deleteProperty(propertyId)
  }
  return { error }
}

// Document operations
export async function uploadDocument(file, propertyId, documentType) {
  if (isDemoMode) {
    // Create a fake URL for demo mode
    const fakeDoc = {
      id: 'doc-' + Date.now(),
      property_id: propertyId,
      type: documentType,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      created_at: new Date().toISOString(),
    }
    useStore.getState().addDocument(fakeDoc)
    return { data: fakeDoc, error: null }
  }

  const user = useStore.getState().user
  const fileName = `${user.id}/${propertyId}/${Date.now()}-${file.name}`

  // Upload file to storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file)

  if (uploadError) {
    return { data: null, error: uploadError }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName)

  // Save document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      property_id: propertyId,
      user_id: user.id,
      type: documentType,
      name: file.name,
      size: file.size,
      path: fileName,
      url: publicUrl,
    })
    .select()
    .single()

  if (!error) {
    useStore.getState().addDocument(data)
  }
  return { data, error }
}

export async function deleteDocument(documentId, filePath) {
  if (isDemoMode || documentId.startsWith('doc-')) {
    useStore.getState().deleteDocument(documentId)
    return { error: null }
  }

  // Delete from storage
  await supabase.storage.from('documents').remove([filePath])

  // Delete record
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (!error) {
    useStore.getState().deleteDocument(documentId)
  }
  return { error }
}

// Lead capture (for non-logged-in users)
export async function saveLead(leadData) {
  if (isDemoMode) {
    console.log('Lead captured (demo mode):', leadData)
    return { data: leadData, error: null }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single()

  return { data, error }
}

// Sync local data to Supabase after login
export async function syncLocalData(userId) {
  if (isDemoMode) return

  const store = useStore.getState()
  
  // Sync properties that were created locally
  for (const property of store.properties) {
    if (property.id.startsWith('local-')) {
      const { data } = await supabase
        .from('properties')
        .insert({
          ...property,
          id: undefined,
          user_id: userId,
        })
        .select()
        .single()
      
      if (data) {
        store.deleteProperty(property.id)
        store.addProperty(data)
      }
    }
  }
}
