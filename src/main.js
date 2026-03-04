import './style.css';
import { createClient } from '@supabase/supabase-js';

// 1. Initialization
const supabaseUrl = 'https://kzdjchmdriobvnmomdlp.supabase.co';
const supabaseKey = 'sb_publishable_lSEYt438K1_BcoNdYhAbyA_cZSVAEep';
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- HIERARCHY RANKING MAP ---
const positionRanks = {
    "Adviser": 1, "Assistant Adviser": 1,
    "President": 2, "Vice President": 2,
    "CAS Senator": 3, "COTE Senator": 3, "CHMT Senator": 3, "CAFE Senator": 3, "COED Senator": 3,
    "BSP HR": 4, "BAEL HR": 4, "BALIT HR": 4, "BSIE HR": 4, "BSIT HR": 4, 
    "BIT-AT HR": 4, "BIT-CT HR": 4, "BIT-ET HR": 4, "BIT-GT HR": 4, "BIT-DT HR": 4, 
    "BSTM HR": 4, "BSHM HR": 4, "BSA HR": 4, "BSF HR": 4, "BSES HR": 4, 
    "BSED Math HR": 4, "BEED HR": 4, "BTLED HR": 4, "BSED English HR": 4,
    "Executive Secretary": 5, "Deputy Executive Secretary": 5, "Press Secretary": 5, "Deputy Press Secretary": 5,
    "Executive Secretary of Finance": 5, "Deputy Secretary of Finance": 5, "Secretary on Audit": 5,
    "Mass Media Director": 6, "Graphics Committee": 6, "Documentation Officer": 6, "Technical Committee": 6,
    "Events and Planning Committee": 6, "Design Officer": 6, "Logistics Committee": 6, "Linkage Committee": 6
};

// --- DATA FETCHING FUNCTIONS ---

async function fetchAnnouncements() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('announcement-list');
    if (data && list) {
        list.innerHTML = data.map(item => `
            <div class="glass p-8 rounded-[2rem] border border-[#800000]/5 hover:border-[#800000]/20 transition-all shadow-sm">
                <span class="inline-block px-3 py-1 bg-[#800000]/5 text-[#800000] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">${item.category || 'General'}</span>
                <h3 class="text-xl font-extrabold text-[#800000] mb-3">${item.title}</h3>
                <p class="text-slate-500 text-sm leading-relaxed">${item.content}</p>
            </div>`).join('');
    }
}

async function fetchTransparency() {
    const { data } = await supabase.from('transparency_reports').select('*').order('report_date', { ascending: false });
    const list = document.getElementById('transparency-list');
    if (data && list) {
        list.innerHTML = data.map(report => `
            <tr class="hover:bg-[#800000]/5 transition-colors group text-xs sm:text-sm">
                <td class="px-4 sm:px-8 py-6 font-bold text-slate-800">${report.project_name}</td>
                <td class="px-4 sm:px-8 py-6 text-right font-mono text-[#800000]">₱ ${report.amount_spent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td class="px-4 sm:px-8 py-6 text-center">
                    ${report.proposal_link 
                        ? `<a href="${report.proposal_link}" target="_blank" class="text-[#800000] hover:underline font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-1">📄 View</a>`
                        : `<span class="text-slate-300 text-[10px] font-bold uppercase">No Doc</span>`}
                </td>
            </tr>`).join('');
    }
}

async function fetchOfficers() {
    const { data } = await supabase.from('ssg_officers').select('*').order('rank', { ascending: true });
    const container = document.getElementById('officer-list');
    if (data && container) {
        const tiers = { 1: "Advisers", 2: "Executive Board", 3: "College Senators", 4: "Departmental HRs", 5: "Secretariat", 6: "Working Committees" };
        container.innerHTML = Object.keys(tiers).map(rank => {
            const tierOfficers = data.filter(o => o.rank == rank);
            if (tierOfficers.length === 0) return '';
            return `
                <div class="mb-10">
                    <h5 class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#800000]/50 mb-5 px-2 italic">${tiers[rank]}</h5>
                    <div class="space-y-4">
                        ${tierOfficers.map(officer => `
                            <div class="bg-white p-6 rounded-[2rem] flex items-center gap-5 shadow-sm border border-slate-50 transition-all hover:shadow-md">
                                <div class="w-16 h-16 bg-[#800000] rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                                    ${officer.photo_url ? `<img src="${officer.photo_url}" class="w-full h-full object-cover rounded-2xl">` : officer.name.charAt(0)}
                                </div>
                                <div class="flex flex-col">
                                    <h4 class="text-xl font-bold text-slate-800 leading-tight">${officer.name}</h4>
                                    <p class="text-[10px] font-bold text-[#800000]/70 uppercase tracking-wider mt-1">${officer.position}</p>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>`;
        }).join('');
    }
}

async function fetchAdminComplaints() {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('admin-complaints-list');
    if (data && container) {
        container.innerHTML = data.map(c => `
            <tr class="hover:bg-slate-50/50 transition-colors ${c.status === 'resolved' ? 'opacity-40' : ''}">
                <td class="px-4 py-4"><span class="px-2 py-1 bg-[#800000]/5 text-[#800000] text-[9px] font-black rounded-full uppercase tracking-tighter">${c.category || 'General'}</span></td>
                <td class="px-4 py-4 font-bold text-slate-800 text-xs sm:text-sm">${c.subject}</td>
                <td class="px-4 py-4 text-[11px] text-slate-500 max-w-xs truncate">${c.description}</td>
                <td class="px-4 py-4 text-center">
                    ${c.status === 'pending' ? `<button onclick="resolveComplaint('${c.id}')" class="text-emerald-600 font-black text-[10px] uppercase hover:underline cursor-pointer">Mark Resolved</button>` : `<span class="text-slate-400 text-[10px] font-black uppercase">Resolved ✅</span>`}
                </td>
            </tr>`).join('');
    }
}

window.resolveComplaint = async (id) => {
    const { error } = await supabase.from('complaints').update({ status: 'resolved' }).eq('id', id);
    if (!error) fetchAdminComplaints();
};

// --- ADMIN PORTAL LOGIC ---
const loginModal = document.getElementById('login-modal');
const adminPortal = document.getElementById('admin-portal');
const landingContent = [document.querySelector('header'), ...document.querySelectorAll('main > section:not(#admin-portal)')];

document.getElementById('open-admin-btn').addEventListener('click', () => loginModal.classList.remove('hidden'));
document.getElementById('close-modal').addEventListener('click', () => loginModal.classList.add('hidden'));

function showAdminView(isAdmin) {
    if (isAdmin) {
        adminPortal.classList.remove('hidden');
        landingContent.forEach(el => el.classList.add('hidden'));
        fetchAdminComplaints();
    } else {
        adminPortal.classList.add('hidden');
        landingContent.forEach(el => el.classList.remove('hidden'));
    }
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
        email: document.getElementById('admin-email').value,
        password: document.getElementById('admin-password').value
    });
    if (error) alert("Invalid credentials.");
    else loginModal.classList.add('hidden');
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
});

supabase.auth.onAuthStateChange((event, session) => {
    showAdminView(!!session);
});

// --- NOTIFICATION HELPER ---
const successModal = document.getElementById('success-modal');
const successContent = document.getElementById('success-modal-content');

function showSuccessNotification(title, message) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    successModal.classList.remove('hidden');
    setTimeout(() => { successContent.classList.remove('scale-95'); successContent.classList.add('scale-100'); }, 10);
}

document.getElementById('close-success-modal').addEventListener('click', () => {
    successContent.classList.add('scale-95'); successContent.classList.remove('scale-100');
    setTimeout(() => successModal.classList.add('hidden'), 200);
});

// --- FORM HANDLERS ---

document.getElementById('complaint-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    const formData = new FormData(e.target);
    const { error } = await supabase.from('complaints').insert([{
        subject: formData.get('subject'), description: formData.get('description'),
        category: formData.get('category'), status: 'pending'
    }]);
    if (!error) { showSuccessNotification("Message Sent!", "The SSG Council has received your concern."); e.target.reset(); }
    btn.disabled = false;
});

document.getElementById('post-announcement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { error } = await supabase.from('announcements').insert([{
        title: formData.get('title'), category: formData.get('category'), content: formData.get('content')
    }]);
    if (!error) { showSuccessNotification("Posted!", "The bulletin board has been updated."); e.target.reset(); fetchAnnouncements(); }
});

document.getElementById('add-transparency-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { error } = await supabase.from('transparency_reports').insert([{
        project_name: formData.get('project_name'), 
        amount_spent: parseFloat(formData.get('amount_spent')), 
        report_date: formData.get('report_date'),
        proposal_link: formData.get('proposal_link')
    }]);
    if (!error) { showSuccessNotification("Published!", "Financial report and proposal link are now live."); e.target.reset(); fetchTransparency(); }
});

document.getElementById('add-officer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pos = formData.get('position');
    const { error } = await supabase.from('ssg_officers').insert([{
        name: formData.get('name'), position: pos, photo_url: formData.get('photo_url'), rank: positionRanks[pos] || 6
    }]);
    if (!error) { showSuccessNotification("Council Updated!", "The officer has been added to the hierarchy."); e.target.reset(); fetchOfficers(); }
});

// --- GLOBAL INIT ---
fetchAnnouncements(); fetchTransparency(); fetchOfficers();