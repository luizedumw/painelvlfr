// Módulo de Contatos
class ContatosManager {
    constructor() {
        this.contatosBody = document.getElementById('contatosBody');
        if (!this.contatosBody) return;

        this.initializeElements();
        this.setupEventListeners();
        this.renderContatos();
        this.atualizarContador();

        console.log('✅ Módulo de contatos inicializado');
    }

    initializeElements() {
        this.btnAddContato = document.getElementById('btn-add-contato');
        this.searchContatos = document.getElementById('searchContatos');
        this.excelFile = document.getElementById('excelFile');
        this.btnClearAll = document.getElementById('btn-clear-all');
        this.totalContatosElement = document.getElementById('totalContatos');

        this.contatos = JSON.parse(localStorage.getItem('contatos')) || this.getContatosPadrao();
        this.currentEditingIndex = null;
    }

    getContatosPadrao() {
        return [
            {
                id: Date.now() + 1,
                afiliado: 'LOJA EXEMPLO SP',
                responsavel: 'CARLOS',
                whatsapp: '11987654321',
                cidade: 'SÃO PAULO/SP'
            },
            {
                id: Date.now() + 2,
                afiliado: 'OFICINA EXEMPLO RJ',
                responsavel: 'MARIA',
                whatsapp: '21912345678',
                cidade: 'RIO DE JANEIRO/RJ'
            }
        ];
    }

    setupEventListeners() {
        if (this.btnAddContato) {
            this.btnAddContato.addEventListener('click', () => this.handleAddContato());
        }

        if (this.searchContatos) {
            this.searchContatos.addEventListener('input', () => this.handleSearchContatos());
        }

        if (this.excelFile) {
            this.excelFile.addEventListener('change', (e) => this.handleExcelImport(e));
        }

        if (this.btnClearAll) {
            this.btnClearAll.addEventListener('click', () => this.clearAllContatos());
        }

        // Botão cancelar edição
        const btnCancel = document.getElementById('btn-cancel-contato');
        if (btnCancel) {
            btnCancel.addEventListener('click', () => this.cancelEdit());
        }

        // Botão exportar
        const btnExport = document.getElementById('btn-export-xlsx');
        if (btnExport) {
            btnExport.addEventListener('click', () => this.exportarContatosXLSX());
        }
    }

    function initializeContatos() {

        const contatosBody = document.getElementById('contatosBody');
        const btnAddContato = document.getElementById('btn-add-contato');
        const searchContatos = document.getElementById('searchContatos');
        const excelFile = document.getElementById('excelFile');
        const btnClearAll = document.getElementById('btn-clear-all');

        // Elementos do contador
        const totalContatosElement = document.getElementById('totalContatos');
        const contatosComWhatsAppElement = document.getElementById('contatosComWhatsApp');
        const contatosComCidadeElement = document.getElementById('contatosComCidade');
        const contatosComResponsavelElement = document.getElementById('contatosComResponsavel');

        if (!contatosBody) return;

        let contatos = JSON.parse(localStorage.getItem('contatos')) || [
            {
                id: Date.now() + 1,
                afiliado: 'LOJA EXEMPLO SP',
                responsavel: 'CARLOS',
                whatsapp: '11987654321',
                cidade: 'SÃO PAULO/SP'
        },
            {
                id: Date.now() + 2,
                afiliado: 'OFICINA EXEMPLO RJ',
                responsavel: 'MARIA',
                whatsapp: '21912345678',
                cidade: 'RIO DE JANEIRO/RJ'
        }
    ];

        let currentEditingIndex = null;

        // FUNÇÃO PARA CONVERTER TEXTO PARA MAIÚSCULO E REMOVER ACENTOS PARA BUSCA
        function normalizarTexto(texto) {
            if (!texto) return '';
            return texto
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .toUpperCase();
        }

        // FUNÇÃO PARA FORMATAR CAMPOS PARA SALVAR (MAIÚSCULO)
        function formatarCamposParaSalvar(afiliado, responsavel, cidade) {
            return {
                afiliado: afiliado ? afiliado.toUpperCase().trim() : '',
                responsavel: responsavel ? responsavel.toUpperCase().trim() : '',
                cidade: cidade ? cidade.toUpperCase().trim() : ''
            };
        }

        function atualizarContador() {
            const total = contatos.length;
            const comWhatsApp = contatos.filter(c => c.whatsapp && c.whatsapp.trim() !== '').length;
            const comCidade = contatos.filter(c => c.cidade && c.cidade.trim() !== '' && c.cidade !== 'NÃO INFORMADO').length;
            const comResponsavel = contatos.filter(c => c.responsavel && c.responsavel.trim() !== '' && c.responsavel !== 'NÃO INFORMADO').length;

            if (totalContatosElement) totalContatosElement.textContent = total;
            if (contatosComWhatsAppElement) contatosComWhatsAppElement.textContent = comWhatsApp;
            if (contatosComCidadeElement) contatosComCidadeElement.textContent = comCidade;
            if (contatosComResponsavelElement) contatosComResponsavelElement.textContent = comResponsavel;

            console.log(`📊 Contador atualizado: ${total} contatos, ${comWhatsApp} com WhatsApp, ${comCidade} com cidade, ${comResponsavel} com responsável`);
        }

        function sortContatos() {
            contatos.sort((a, b) => a.afiliado.localeCompare(b.afiliado, 'pt-BR'));
        }

        function saveContatos() {
            sortContatos();
            localStorage.setItem('contatos', JSON.stringify(contatos));
            renderContatos();
            atualizarContador();
        }

        const renderContatos = (contatosParaRenderizar = contatos) => {
            contatosBody.innerHTML = '';
            contatosParaRenderizar.forEach((contato, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${contato.afiliado}</td>
                <td>${contato.responsavel}</td>
                <td>${contato.whatsapp}</td>
                <td>${contato.cidade}</td>
                <td class="actions-cell">
                    <span class="material-icons-sharp edit-btn" data-id="${contato.id}">edit</span>
                    <span class="material-icons-sharp delete-btn" data-id="${contato.id}">delete_outline</span>
                </td>
            `;
                contatosBody.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', handleEditContato);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', handleDeleteContato);
            });

            localStorage.setItem('contatos', JSON.stringify(contatos));
            localStorage.setItem('contatosData', JSON.stringify(contatos));

            atualizarContador();
        };

        function handleAddContato() {
            const afiliado = document.getElementById('contato-afiliado').value.trim();
            const responsavel = document.getElementById('contato-responsavel').value.trim();
            const whatsapp = document.getElementById('contato-whatsapp').value.trim();
            const cidade = document.getElementById('contato-cidade').value.trim();

            if (!afiliado) {
                showToast('Nome do afiliado é obrigatório!', 'error');
                return;
            }
            if (!whatsapp) {
                showToast('WhatsApp é obrigatório!', 'error');
                return;
            }

            // FORMATA OS CAMPOS PARA MAIÚSCULO
            const camposFormatados = formatarCamposParaSalvar(afiliado, responsavel, cidade);

            const exists = contatos.some(c =>
                normalizarTexto(c.afiliado) === normalizarTexto(camposFormatados.afiliado) &&
                c.whatsapp === whatsapp
            );

            if (currentEditingIndex !== null) {
                contatos[currentEditingIndex] = {
                    id: contatos[currentEditingIndex].id,
                    afiliado: camposFormatados.afiliado,
                    responsavel: camposFormatados.responsavel || "NÃO INFORMADO",
                    whatsapp: whatsapp,
                    cidade: camposFormatados.cidade || "NÃO INFORMADO"
                };
                currentEditingIndex = null;
                btnAddContato.textContent = 'Adicionar';
                showToast('Contato atualizado com sucesso!', 'success');
            } else {
                if (exists) {
                    showToast('Esse contato já existe!', 'warning');
                } else {
                    contatos.push({
                        id: Date.now(),
                        afiliado: camposFormatados.afiliado,
                        responsavel: camposFormatados.responsavel || "NÃO INFORMADO",
                        whatsapp: whatsapp,
                        cidade: camposFormatados.cidade || "NÃO INFORMADO"
                    });
                    showToast('Contato adicionado com sucesso!', 'success');
                }
            }

            document.getElementById('contato-afiliado').value = '';
            document.getElementById('contato-responsavel').value = '';
            document.getElementById('contato-whatsapp').value = '';
            document.getElementById('contato-cidade').value = '';

            saveContatos();
        }

        function handleEditContato(e) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const contato = contatos.find(c => c.id === id);
            const index = contatos.findIndex(c => c.id === id);
            currentEditingIndex = index;

            document.getElementById('contato-afiliado').value = contato.afiliado;
            document.getElementById('contato-responsavel').value = contato.responsavel || '';
            document.getElementById('contato-whatsapp').value = contato.whatsapp;
            document.getElementById('contato-cidade').value = contato.cidade || '';

            currentEditingIndex = index;
            btnAddContato.textContent = 'Atualizar';

            document.querySelector('.add-contato-form').scrollIntoView({
                behavior: 'smooth'
            });
        }

        document.getElementById('btn-cancel-contato').addEventListener('click', () => {
            document.getElementById('contato-afiliado').value = '';
            document.getElementById('contato-responsavel').value = '';
            document.getElementById('contato-whatsapp').value = '';
            document.getElementById('contato-cidade').value = '';
            currentEditingIndex = null;
            btnAddContato.textContent = 'Adicionar';
        });

        function exportarContatosXLSX() {
            const wb = XLSX.utils.book_new();
            const wsData = contatos.map(c => [c.afiliado, c.responsavel, c.whatsapp, c.cidade]);
            wsData.unshift(["AFILIADO", "RESPONSÁVEL", "WHATSAPP", "CIDADE/UF"]);
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, "Contatos");
            XLSX.writeFile(wb, "contatos.xlsx");
        }

        document.getElementById('btn-export-xlsx').addEventListener('click', exportarContatosXLSX);

        function handleDeleteContato(e) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const contatoIndex = contatos.findIndex(c => c.id === id);

            if (contatoIndex === -1) {
                showToast('Contato não encontrado!', 'error');
                return;
            }

            const contato = contatos[contatoIndex];

            const modal = document.getElementById('deleteModal');
            const message = document.getElementById('deleteModalMessage');
            const cancelBtn = document.getElementById('deleteModalCancel');
            const confirmBtn = document.getElementById('deleteModalConfirm');

            message.textContent = `Tem certeza que deseja excluir o contato "${contato.afiliado}"?`;

            modal.style.display = 'block';

            const newCancelBtn = cancelBtn.cloneNode(true);
            const newConfirmBtn = confirmBtn.cloneNode(true);

            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

            const handleCancel = () => {
                modal.style.display = 'none';
                showToast('Exclusão cancelada', 'warning');
            };

            const handleConfirm = () => {
                contatos.splice(contatoIndex, 1);
                saveContatos();
                modal.style.display = 'none';
                showToast('Contato excluído com sucesso!', 'success');
            };

            newCancelBtn.addEventListener('click', handleCancel);
            newConfirmBtn.addEventListener('click', handleConfirm);
        }

        // FUNÇÃO NOVA PARA LIMPAR TODOS OS CONTATOS
        function clearAllContatos() {
            const modal = document.getElementById('deleteModal');
            const message = document.getElementById('deleteModalMessage');
            const cancelBtn = document.getElementById('deleteModalCancel');
            const confirmBtn = document.getElementById('deleteModalConfirm');

            message.textContent = '🚨 ATENÇÃO: Tem certeza que deseja excluir TODOS os contatos? Esta ação não pode ser desfeita e todos os dados serão perdidos permanentemente.';

            modal.style.display = 'block';

            // Remover event listeners anteriores
            const newCancelBtn = cancelBtn.cloneNode(true);
            const newConfirmBtn = confirmBtn.cloneNode(true);

            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

            // Adicionar novos event listeners
            newCancelBtn.addEventListener('click', function handleCancel() {
                modal.style.display = 'none';
                showToast('Ação cancelada', 'warning');
            });

            newConfirmBtn.addEventListener('click', function handleConfirm() {
                // LIMPAR TODOS OS CONTATOS
                contatos = [];
                localStorage.removeItem('contatos');
                localStorage.removeItem('contatosData');

                // Atualizar a interface
                renderContatos();

                // Fechar modal e mostrar confirmação
                modal.style.display = 'none';
                showToast('✅ Todos os contatos foram excluídos com sucesso!', 'success');

                console.log('Contatos limpos:', contatos);
                console.log('LocalStorage contatos:', localStorage.getItem('contatos'));
            });
        }

        function handleSearchContatos() {
            const searchTerm = searchContatos.value.toLowerCase().trim();

            if (searchTerm === '') {
                renderContatos(contatos);
                return;
            }

            // NORMALIZA O TERMO DE BUSCA (REMOVE ACENTOS)
            const termoNormalizado = normalizarTexto(searchTerm);

            const filteredContatos = contatos.filter(contato =>
                normalizarTexto(contato.afiliado).includes(termoNormalizado) ||
                normalizarTexto(contato.responsavel).includes(termoNormalizado) ||
                contato.whatsapp.includes(searchTerm) ||
                normalizarTexto(contato.cidade).includes(termoNormalizado)
            );

            renderContatos(filteredContatos);
        }

        function handleExcelImport(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, {
                    type: 'array'
                });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet, {
                    header: 1
                });

                rows.shift(); // remove cabeçalho

                rows.forEach(row => {
                    if (!row || row.length < 2) return;
                    const [afiliado, responsavel, whatsapp, cidade] = row.map(c => c ? c.toString().trim() : "");

                    if (!afiliado || !whatsapp) return;

                    // FORMATA OS CAMPOS PARA MAIÚSCULO AO IMPORTAR
                    const camposFormatados = formatarCamposParaSalvar(afiliado, responsavel, cidade);

                    const exists = contatos.some(c =>
                        normalizarTexto(c.afiliado) === normalizarTexto(camposFormatados.afiliado) &&
                        c.whatsapp === whatsapp
                    );

                    if (!exists) {
                        contatos.push({
                            id: Date.now() + Math.floor(Math.random() * 100000),
                            afiliado: camposFormatados.afiliado,
                            responsavel: camposFormatados.responsavel || "NÃO INFORMADO",
                            whatsapp: whatsapp,
                            cidade: camposFormatados.cidade || "NÃO INFORMADO"
                        });
                    }
                });

                saveContatos();
                showToast('Contatos importados com sucesso!', 'success');
            };
            reader.readAsArrayBuffer(file);
        }

        // ATUALIZE AS FUNÇÕES DE PROCESSAMENTO DO EXCEL
        function processSpecificExcelFile(excelData) {
            const newContatos = [];

            console.log('=== INICIANDO PROCESSAMENTO DO EXCEL ===');
            console.log('Total de linhas:', excelData.length);

            for (let i = 0; i < excelData.length; i++) {
                const row = excelData[i];

                // Pular linhas vazias
                if (!row || row.length < 1) continue;

                // Pular cabeçalho
                if (row[0] && row[0].toString().trim().toUpperCase() === "AFILIADO") {
                    continue;
                }

                // Pegar dados corretamente de cada coluna
                const afiliado = row[0] ? row[0].toString().trim() : "";
                const responsavel = row[1] ? row[1].toString().trim() : "";
                const whatsapp = row[2] ? row[2].toString().trim() : "";
                const cidade = row[3] ? row[3].toString().trim() : "";

                // Só adiciona se tiver pelo menos afiliado e whatsapp
                if (afiliado && whatsapp) {
                    // FORMATA PARA MAIÚSCULO
                    const camposFormatados = formatarCamposParaSalvar(afiliado, responsavel, cidade);

                    newContatos.push({
                        afiliado: camposFormatados.afiliado,
                        responsavel: camposFormatados.responsavel,
                        whatsapp: formatWhatsApp(whatsapp),
                        cidade: camposFormatados.cidade
                    });
                }
            }

            console.log('=== PROCESSAMENTO CONCLUÍDO ===');
            console.log('Contatos válidos encontrados:', newContatos.length);
            return newContatos;
        }

        function processGenericExcelFile(excelData) {
            const headerRow = excelData[0];
            const newContatos = [];

            const afiliadoIndex = headerRow.findIndex(cell =>
                cell && normalizarTexto(cell.toString()).includes('AFILIADO') ||
                cell && normalizarTexto(cell.toString()).includes('NOME')
            );

            const responsavelIndex = headerRow.findIndex(cell =>
                cell && normalizarTexto(cell.toString()).includes('RESPONSAVEL') ||
                cell && normalizarTexto(cell.toString()).includes('RESPONSÁVEL')
            );

            const whatsappIndex = headerRow.findIndex(cell =>
                cell && normalizarTexto(cell.toString()).includes('WHATSAPP') ||
                cell && normalizarTexto(cell.toString()).includes('TELEFONE') ||
                cell && normalizarTexto(cell.toString()).includes('CONTATO')
            );

            const cidadeIndex = headerRow.findIndex(cell =>
                cell && normalizarTexto(cell.toString()).includes('CIDADE') ||
                cell && normalizarTexto(cell.toString()).includes('LOCAL')
            );

            const estadoIndex = headerRow.findIndex(cell =>
                cell && normalizarTexto(cell.toString()).includes('ESTADO') ||
                cell && normalizarTexto(cell.toString()).includes('UF')
            );

            for (let i = 1; i < excelData.length; i++) {
                const row = excelData[i];
                if (!row || row.length === 0) continue;

                const afiliado = afiliadoIndex >= 0 ? (row[afiliadoIndex] || '').toString().trim() : '';
                const responsavel = responsavelIndex >= 0 ? (row[responsavelIndex] || '').toString().trim() : '';
                const whatsapp = whatsappIndex >= 0 ? (row[whatsappIndex] || '').toString().trim() : '';

                let cidade = '';
                if (cidadeIndex >= 0 && estadoIndex >= 0) {
                    const cidadeVal = (row[cidadeIndex] || '').toString().trim();
                    const estadoVal = (row[estadoIndex] || '').toString().trim();
                    cidade = cidadeVal + (estadoVal ? '/' + estadoVal : '');
                } else if (cidadeIndex >= 0) {
                    cidade = (row[cidadeIndex] || '').toString().trim();
                }

                if (afiliado && whatsapp) {
                    // FORMATA PARA MAIÚSCULO
                    const camposFormatados = formatarCamposParaSalvar(afiliado, responsavel, cidade);

                    newContatos.push({
                        afiliado: camposFormatados.afiliado,
                        responsavel: camposFormatados.responsavel,
                        whatsapp: formatWhatsApp(whatsapp),
                        cidade: camposFormatados.cidade
                    });
                }
            }

            return newContatos;
        }

        function formatWhatsApp(whatsapp) {
            let numero = whatsapp.replace(/\D/g, '');

            if (numero.length === 11 && numero.startsWith('0') === false) {
                numero = '55' + numero;
            }

            if (numero.length === 12) {
                return `+${numero.slice(0,2)} (${numero.slice(2,4)}) ${numero.slice(4,9)}-${numero.slice(9)}`;
            }

            return whatsapp;
        }

        if (btnAddContato) {
            btnAddContato.addEventListener('click', handleAddContato);
        }

        if (searchContatos) {
            searchContatos.addEventListener('input', handleSearchContatos);
        }

        if (excelFile) {
            excelFile.addEventListener('change', handleExcelImport);
        }

        // EVENT LISTENER PARA O BOTÃO LIMPAR TODOS
        if (btnClearAll) {
            btnClearAll.addEventListener('click', clearAllContatos);
            console.log('Botão Limpar Todos inicializado');
        }

        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.addEventListener('click', function (e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });

        // GARANTIR QUE OS CONTATOS EXISTENTES ESTEJEM EM MAIÚSCULO
        contatos = contatos.map(contato => ({
            ...contato,
            afiliado: contato.afiliado ? contato.afiliado.toUpperCase() : '',
            responsavel: contato.responsavel ? contato.responsavel.toUpperCase() : '',
            cidade: contato.cidade ? contato.cidade.toUpperCase() : ''
        }));

        renderContatos();
        atualizarContador();
        console.log('✅ Módulo de contatos inicializado');
    }

    window.showToast = function (message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'check_circle' :
            type === 'error' ? 'error' : 'warning';

        toast.innerHTML = `
            <span class="material-icons-sharp">${icon}</span>
            ${message}
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}

// Inicializar quando a página de contatos for carregada
if (document.getElementById('contatosBody')) {
    document.addEventListener('DOMContentLoaded', () => {
        new ContatosManager();
    });
}