import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export type Conversation = {
  id: string
  job_id: string
  worker_id: string
  employer_id: string
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  message_type: 'text' | 'photo' | 'system'
  text_content?: string
  photo_url?: string
  system_event?: 'work_started' | 'work_completed' | 'work_approved' | 'work_rejected'
  created_at: string
}

/**
 * Находит или создает разговор между работником и работодателем по конкретной работе
 */
export async function findOrCreateConversation(jobId: string, workerId: string, employerId: string): Promise<Conversation> {
  // Сначала попробуем найти существующий разговор
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('job_id', jobId)
    .eq('worker_id', workerId)
    .single()

  if (findError && findError.code !== 'PGRST116') { // PGRST116 = not found
    throw new Error(`Failed to find conversation: ${findError.message}`)
  }

  if (existing) {
    return existing
  }

  // Создаем новый разговор
  const { data: newConversation, error: createError } = await supabase
    .from('conversations')
    .insert({
      job_id: jobId,
      worker_id: workerId,
      employer_id: employerId
    })
    .select()
    .single()

  if (createError) {
    throw new Error(`Failed to create conversation: ${createError.message}`)
  }

  return newConversation
}

/**
 * Получает все разговоры для пользователя
 */
export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`worker_id.eq.${userId},employer_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`)
  }

  return data || []
}

/**
 * Получает разговор по ID
 */
export async function getConversationById(conversationId: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch conversation: ${error.message}`)
  }

  return data || null
}

/**
 * Получает все сообщения для разговора
 */
export async function getMessagesForConversation(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }

  return data || []
}

/**
 * Создает новое сообщение
 */
export async function createMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message_type: 'text',
      text_content: text
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create message: ${error.message}`)
  }

  // Обновляем updated_at для разговора
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data
}

/**
 * Создает сообщение с фото
 */
export async function createPhotoMessage(conversationId: string, senderId: string, photoUrl: string, caption?: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message_type: 'photo',
      photo_url: photoUrl,
      text_content: caption
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create photo message: ${error.message}`)
  }

  // Обновляем updated_at для разговора
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data
}

/**
 * Создает системное сообщение
 */
export async function createSystemMessage(conversationId: string, systemEvent: 'work_started' | 'work_completed' | 'work_approved' | 'work_rejected'): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: 'system',
      message_type: 'system',
      system_event: systemEvent
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create system message: ${error.message}`)
  }

  // Обновляем updated_at для разговора
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data
}

/**
 * Проверяет, является ли пользователь участником разговора
 */
export async function isUserInConversation(conversationId: string, userId: string): Promise<boolean> {
  const conversation = await getConversationById(conversationId)
  return conversation ? (conversation.worker_id === userId || conversation.employer_id === userId) : false
}