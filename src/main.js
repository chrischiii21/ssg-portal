import './style.css'; // This ensures your Maroon/Yellow styles load
import { createClient } from '@supabase/supabase-js';

// 1. Database Configuration (Only define these ONCE)
const supabaseUrl = 'https://kzdjchmdriobvnmomdlp.supabase.co'; // From your dashboard
const supabaseKey = 'sb_publishable_lSEYt438K1_BcoNdYhAbyA_cZSVAEep'; // From your logs

// 2. Initialize the client
export const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Logic to load announcements
async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('announcement-list');
  if (data && list) {
    list.innerHTML = data.map(item => `
            <div class="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#800000]/10 hover:border-[#800000] transition-all">
                <span class="text-[10px] font-black uppercase text-[#800000] tracking-widest">${item.category || 'General'}</span>
                <h3 class="text-xl font-bold mt-1 text-slate-800">${item.title}</h3>
                <p class="text-slate-600 mt-2 text-sm">${item.content}</p>
            </div>
        `).join('');
  }
}

// Start fetching
fetchAnnouncements();