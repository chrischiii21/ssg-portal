import './style.css'

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { supabase } from './lib/supabaseClient'

const supabaseUrl = 'https://kzdjchmdriobvnmomdlp.supabase.co'
const supabaseKey = 'sb_publishable_lSEYt438K1_BcoNdYhAbyA_cZSVAEep'

export const supabase = createClient(supabaseUrl, supabaseKey)

async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error)
    return
  }

  const container = document.querySelector('#announcement-feed')
  container.innerHTML = data.map(news => `
    <div class="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition">
      <div class="flex items-center gap-2 mb-2">
        <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full uppercase">${news.category}</span>
        <span class="text-xs text-slate-400">${new Date(news.created_at).toLocaleDateString()}</span>
      </div>
      <h3 class="text-xl font-bold text-slate-800">${news.title}</h3>
      <p class="mt-2 text-slate-600 leading-relaxed">${news.content}</p>
    </div>
  `).join('')
}

// Run it!
getAnnouncements()