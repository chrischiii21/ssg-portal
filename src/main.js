import './style.css';
import { createClient } from '@supabase/supabase-js';

// 1. Initialization
const supabaseUrl = 'https://kzdjchmdriobvnmomdlp.supabase.co';
const supabaseKey = 'sb_publishable_lSEYt438K1_BcoNdYhAbyA_cZSVAEep';
export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Fetch Announcements
async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('announcement-list');
  if (data && list) {
    list.innerHTML = data.map(item => `
            <div class="glass p-8 rounded-[2rem] border border-[#800000]/5 hover:border-[#800000]/20 transition-all shadow-sm">
                <span class="inline-block px-3 py-1 bg-[#800000]/5 text-[#800000] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                    ${item.category || 'General'}
                </span>
                <h3 class="text-xl font-extrabold text-[#800000] mb-3">${item.title}</h3>
                <p class="text-slate-500 text-sm leading-relaxed">${item.content}</p>
            </div>
        `).join('');
  }
}

// 3. Fetch Transparency Reports
async function fetchTransparency() {
  const { data, error } = await supabase
    .from('transparency_reports')
    .select('*')
    .order('report_date', { ascending: false });

  const list = document.getElementById('transparency-list');
  if (data && list) {
    list.innerHTML = data.map(report => `
            <tr class="hover:bg-[#800000]/5 transition-colors group">
                <td class="px-8 py-6 font-bold text-slate-800">${report.project_name}</td>
                <td class="px-8 py-6 text-right font-mono text-[#800000]">₱ ${report.amount_spent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td class="px-8 py-6 text-center">
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Published</span>
                </td>
            </tr>
        `).join('');
  }
}

// 4. Fetch Org Chart (Officers)
async function fetchOfficers() {
  const { data, error } = await supabase
    .from('ssg_officers')
    .select('*')
    .order('rank', { ascending: true });

  const list = document.getElementById('officer-list');
  if (data && list) {
    list.innerHTML = data.map(officer => `
            <div class="glass p-4 rounded-2xl flex items-center gap-4 border border-white/50 shadow-sm transition-transform hover:scale-[1.02]">
                <div class="w-14 h-14 bg-[#800000]/10 rounded-xl overflow-hidden flex items-center justify-center border border-[#800000]/20">
                    ${officer.photo_url
        ? `<img src="${officer.photo_url}" alt="${officer.name}" class="w-full h-full object-cover">`
        : `<span class="text-[#800000] font-bold text-xl">${officer.name.charAt(0)}</span>`
      }
                </div>
                <div>
                    <h4 class="font-bold text-slate-800 leading-none">${officer.name}</h4>
                    <p class="text-[10px] font-bold text-[#800000] uppercase tracking-wider mt-1">${officer.position}</p>
                </div>
            </div>
        `).join('');
  }
}

// 5. Submit Complaint
const complaintForm = document.getElementById('complaint-form');
if (complaintForm) {
  complaintForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = "Transmitting...";
    btn.disabled = true;

    const formData = new FormData(complaintForm);
    const { error } = await supabase
      .from('complaints')
      .insert([{
        subject: formData.get('subject'),
        description: formData.get('description'),
        status: 'pending'
      }]);

    if (!error) {
      alert("Your concern has been successfully transmitted to the council.");
      complaintForm.reset();
    } else {
      alert("Submission failed: " + error.message);
    }

    btn.innerText = originalText;
    btn.disabled = false;
  });
}

// Global Initialization
function init() {
  fetchAnnouncements();
  fetchTransparency();
  fetchOfficers();
}

init();