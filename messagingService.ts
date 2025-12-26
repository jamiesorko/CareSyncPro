
import { supabase } from '../lib/supabase';
import { ChatThread, ChatMessage } from '../types';

export class MessagingService {
  private companyId: string | null = null;

  setContext(id: string) {
    this.companyId = id;
  }

  async getThreads(): Promise<ChatThread[]> {
    if (!supabase || !this.companyId) {
      // Fix: Added missing companyId to mock ChatThread initialization
      return [{ id: 'staff-global', companyId: this.companyId || 'demo', name: 'Global Roster Channel', type: 'GROUP', lastMessage: 'Biometric link active.', unreadCount: 0 }];
    }
    const { data } = await supabase.from('chat_threads').select('*').eq('company_id', this.companyId);
    return (data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      unreadCount: 0,
      lastMessage: t.last_message
    }));
  }

  async getMessages(threadId: string): Promise<ChatMessage[]> {
    if (!supabase) return [];
    const { data } = await supabase
      .from('chat_messages')
      .select('*, staff(name)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    
    return (data || []).map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      senderName: m.staff?.name || 'System',
      text: m.content,
      timestamp: m.created_at
    }));
  }

  async sendMessage(threadId: string, text: string): Promise<void> {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('chat_messages').insert([{
      thread_id: threadId,
      sender_id: user.id,
      content: text
    }]);
  }
}

export const messagingService = new MessagingService();
