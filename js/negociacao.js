    // Módulo de Negociação
class NegociacaoManager {
    constructor() {
        this.form = document.getElementById('formNegociacao');
        if (!this.form) return;

        this.initializeElements();
        this.setupEventListeners();
        this.loadFormData();

        console.log('✅ Módulo de negociação inicializado');
    }

    initializeElements() {
        // Elementos do formulário
        this.valorInicialInput = document.getElementById('valorInicial');
        this.valorNegociadoInput = document.getElementById('valorNegociado');
        this.valorDeslocamentoInput = document.getElementById('valorDeslocamento');
        this.statusSelect = document.getElementById('status');
        this.prestadorInput = document.getElementById('prestador');
        this.responsavelInput = document.getElementById('responsavel');
        this.whatsappInput = document.getElementById('whatsapp');
        this.prestadorSuggestions = document.getElementById('prestador-suggestions');
        this.prevChegadaBox = document.getElementById('prevChegadaBox');
        this.agendamentosBox = document.getElementById('agendamentosBox');
        this.isAcessoriosCheckbox = document.getElementById('isAcessorios');
        this.acessoriosMarcaBox = document.getElementById('acessoriosMarcaBox');
        this.vidrosMarcaBox = document.getElementById('vidrosMarcaBox');
        this.marcaAcessoriosSelect = document.getElementById('marca_acessorios');
        this.marcaVidrosSelect = document.getElementById('marca_vidros');
        this.resultadoTextarea = document.getElementById('resultado');
        this.cMovelCheckbox = document.getElementById('cMovel');
        this.movelOptions = document.getElementById('movelOptions');
        this.cortesiaCheckbox = document.getElementById('cortesia');
        this.btnGenerate = document.getElementById('btnGenerate');
        this.btnCopy = document.getElementById('btnCopy');
        this.btnClear = document.getElementById('btnClear');
        this.ordemChegadaCheckbox = document.getElementById('ordemChegada');

        this.allFormInputs = this.form.querySelectorAll('input, select, textarea');
        this.contatosData = JSON.parse(localStorage.getItem("contatosData")) || [];
    }

    setupEventListeners() {
        // Event listeners principais
        if (this.statusSelect) this.statusSelect.addEventListener('change', () => this.toggleDateFields());
        if (this.isAcessoriosCheckbox) this.isAcessoriosCheckbox.addEventListener('change', () => this.toggleMarcaFields());
        if (this.cMovelCheckbox) this.cMovelCheckbox.addEventListener('change', () => this.toggleMovelFields());
        if (this.cortesiaCheckbox) this.cortesiaCheckbox.addEventListener('change', () => this.toggleMovelFields());

        if (this.btnGenerate) this.btnGenerate.addEventListener('click', () => this.generateMessage());
        if (this.btnCopy) this.btnCopy.addEventListener('click', () => this.copyMessage());
        if (this.btnClear) this.btnClear.addEventListener('click', () => this.clearFormData());

        this.form.addEventListener('input', () => this.saveFormData());

        // Mascaras de moeda
        if (this.valorInicialInput) this.aplicarMascaraMoeda(this.valorInicialInput);
        if (this.valorNegociadoInput) this.aplicarMascaraMoeda(this.valorNegociadoInput);
        if (this.valorDeslocamentoInput) this.aplicarMascaraMoeda(this.valorDeslocamentoInput);

        // Autocomplete
        this.setupAutocomplete();

        // Populate marcas
        this.populateMarcas();
    }

    function initializeNegociacao() {
        const form = document.getElementById('formNegociacao');
        if (!form) {
            console.log('❌ Formulário de negociação não encontrado');
            return;
        }

        console.log('✅ Inicializando módulo de negociação...');
        const valorInicialInput = document.getElementById('valorInicial');
        const valorNegociadoInput = document.getElementById('valorNegociado');
        const allFormInputs = form.querySelectorAll('input, select');
        const statusSelect = document.getElementById('status');
        const prestadorInput = document.getElementById('prestador');
        const responsavelInput = document.getElementById('responsavel');
        const whatsappInput = document.getElementById('whatsapp');
        const prestadorSuggestions = document.getElementById('prestador-suggestions');
        const prevChegadaBox = document.getElementById('prevChegadaBox');
        const agendamentosBox = document.getElementById('agendamentosBox');
        const isAcessoriosCheckbox = document.getElementById('isAcessorios');
        const acessoriosMarcaBox = document.getElementById('acessoriosMarcaBox');
        const vidrosMarcaBox = document.getElementById('vidrosMarcaBox');
        const marcaAcessoriosSelect = document.getElementById('marca_acessorios');
        const marcaVidrosSelect = document.getElementById('marca_vidros');
        const resultadoTextarea = document.getElementById('resultado');
        const cMovelCheckbox = document.getElementById('cMovel');
        const movelOptions = document.getElementById('movelOptions');
        const cortesiaCheckbox = document.getElementById('cortesia');
        const valorDeslocamentoInput = document.getElementById('valorDeslocamento');
        const btnGenerate = document.getElementById('btnGenerate');
        const btnCopy = document.getElementById('btnCopy');
        const btnClear = document.getElementById('btnClear');

        if (typeof MARCAS_ACESSORIOS === 'undefined' || typeof MARCAS_VIDROS === 'undefined') {
            console.error('❌ Arquivo marcas.js não carregado corretamente');
            return;
        }

        const marcas = {
            acessorios: MARCAS_ACESSORIOS,
            vidros: MARCAS_VIDROS
        };

        let contatosData = JSON.parse(localStorage.getItem("contatosData")) || [];

        function populateSelect(selectElement, data) {
            if (!selectElement) return;

            selectElement.innerHTML = '<option value="">-- escolha --</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElement.appendChild(option);
            });
        }

        function parseMoedaParaNumero(valorFormatado) {
            if (!valorFormatado) return 0;

            // Converte diferentes formatos para número
            let valorString = valorFormatado.toString();

            // Se já está no formato "123,45" ou "1.234,56"
            if (valorString.includes(',')) {
                // Remove pontos de milhar e converte vírgula decimal para ponto
                valorString = valorString.replace(/\./g, '').replace(',', '.');
            }

            const numero = parseFloat(valorString);
            return isNaN(numero) ? 0 : numero;
        }

        function aplicarMascaraMoeda(input) {
            if (!input) return;

            input.addEventListener('blur', function () {
                if (this.value.trim() === '' || parseMoedaParaNumero(this.value) === 0) {
                    this.value = '';
                } else {
                    const valorNumerico = parseMoedaParaNumero(this.value);
                    this.value = valorNumerico.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
                if (typeof saveFormData === 'function') {
                    saveFormData();
                }
            });

            input.addEventListener('focus', function () {
                const valorNumerico = parseMoedaParaNumero(this.value);
                if (valorNumerico !== 0) {
                    this.value = valorNumerico.toFixed(2).replace('.', ',');
                } else {
                    this.value = '';
                }
            });

            input.addEventListener('input', function (e) {
                let value = this.value.replace(/[^\d,]/g, '');
                let parts = value.split(',');
                if (parts.length > 2) {
                    value = parts[0] + ',' + parts.slice(1).join('');
                }
                if (parts[1] && parts[1].length > 2) {
                    parts[1] = parts[1].substring(0, 2);
                    value = parts.join(',');
                }
                this.value = value;
            });
        }

        // INICIALIZA AS MÁSCARAS DE MOEDA (ADICIONE ESTAS LINHAS)
        if (valorInicialInput) aplicarMascaraMoeda(valorInicialInput);
        if (valorNegociadoInput) aplicarMascaraMoeda(valorNegociadoInput);
        if (valorDeslocamentoInput) aplicarMascaraMoeda(valorDeslocamentoInput);

        function setupAutocomplete() {
            if (!prestadorInput || !prestadorSuggestions) return;

            prestadorInput.addEventListener('input', function () {
                const query = this.value.toLowerCase().trim();
                prestadorSuggestions.innerHTML = '';

                if (query.length < 2) {
                    prestadorSuggestions.style.display = 'none';
                    return;
                }

                const matches = contatosData.filter(contato =>
                    contato.afiliado.toLowerCase().includes(query) ||
                    (contato.responsavel && contato.responsavel.toLowerCase().includes(query))
                ).slice(0, 5);

                if (matches.length > 0) {
                    matches.forEach(contato => {
                        const div = document.createElement('div');
                        div.className = 'autocomplete-suggestion';
                        div.textContent = `${contato.afiliado} - ${contato.responsavel || 'Não Informado'} - ${contato.whatsapp || 'Não Informado'}`;
                        div.addEventListener('click', function () {
                            prestadorInput.value = contato.afiliado;
                            if (responsavelInput) responsavelInput.value = contato.responsavel || 'Não Informado';
                            if (whatsappInput) whatsappInput.value = contato.whatsapp || 'Não Informado';
                            prestadorSuggestions.style.display = 'none';
                            saveFormData();
                        });
                        prestadorSuggestions.appendChild(div);
                    });
                    prestadorSuggestions.style.display = 'block';
                } else {
                    prestadorSuggestions.style.display = 'none';
                }
            });

            document.addEventListener('click', function (e) {
                if (prestadorInput && !prestadorInput.contains(e.target) &&
                    prestadorSuggestions && !prestadorSuggestions.contains(e.target)) {
                    prestadorSuggestions.style.display = 'none';
                }
            });
        }

        function toggleDateFields() {
            if (!statusSelect || !agendamentosBox || !prevChegadaBox) return;

            if (statusSelect.value === 'DISPONÍVEL') {
                agendamentosBox.classList.remove('hidden');
                prevChegadaBox.classList.add('hidden');
            } else if (statusSelect.value === 'INDISPONÍVEL') {
                agendamentosBox.classList.add('hidden');
                prevChegadaBox.classList.remove('hidden');
            } else {
                agendamentosBox.classList.add('hidden');
                prevChegadaBox.classList.add('hidden');
            }
        }

        function toggleMarcaFields() {
            if (!isAcessoriosCheckbox || !acessoriosMarcaBox || !vidrosMarcaBox) return;

            if (isAcessoriosCheckbox.checked) {
                acessoriosMarcaBox.classList.remove('hidden');
                vidrosMarcaBox.classList.add('hidden');
            } else {
                acessoriosMarcaBox.classList.add('hidden');
                vidrosMarcaBox.classList.remove('hidden');
            }
        }

        function toggleMovelFields() {
            if (!cMovelCheckbox || !movelOptions || !cortesiaCheckbox || !valorDeslocamentoInput) return;

            if (cMovelCheckbox.checked) {
                movelOptions.classList.remove('hidden');
                valorDeslocamentoInput.disabled = cortesiaCheckbox.checked;
                if (cortesiaCheckbox.checked) {
                    valorDeslocamentoInput.value = '';
                }
            } else {
                movelOptions.classList.add('hidden');
            }
        }

        function formatCurrency(value) {
            const number = parseFloat(value);
            if (isNaN(number)) return "";
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(number);
        }

        function formatDateShort(dateString) {
            if (!dateString) return '';
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}`;
        }

        function calculateBusinessDays(endDateStr) {
            if (!endDateStr) return 0;
            const today = new Date();
            const endDate = new Date(endDateStr + 'T12:00:00');
            today.setHours(0, 0, 0, 0);
            let count = 0;
            const curDate = new Date(today);
            curDate.setDate(curDate.getDate() + 1);
            while (curDate <= endDate) {
                const dayOfWeek = curDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
                curDate.setDate(curDate.getDate() + 1);
            }
            return count;
        }

        function saveFormData() {
            const data = {};
            allFormInputs.forEach(input => {
                if (input.id) {
                    if (input.type === 'checkbox') {
                        data[input.id] = input.checked;
                    } else if (['valorInicial', 'valorNegociado', 'valorDeslocamento'].includes(input.id)) {
                        // Salva o valor numérico para os campos de moeda
                        data[input.id] = parseMoedaParaNumero(input.value);
                    } else {
                        data[input.id] = input.value;
                    }
                }
            });

            const ordemChegadaCheckbox = document.getElementById('ordemChegada');
            if (ordemChegadaCheckbox) {
                data.ordemChegada = ordemChegadaCheckbox.checked;
            }

            localStorage.setItem('negociacaoFormData', JSON.stringify(data));
        }

        function loadFormData() {
            const data = JSON.parse(localStorage.getItem('negociacaoFormData'));
            if (data) {
                allFormInputs.forEach(input => {
                    if (input.id && data[input.id] !== undefined) {
                        if (input.type === 'checkbox') {
                            input.checked = data[input.id];
                        } else if (['valorInicial', 'valorNegociado', 'valorDeslocamento'].includes(input.id)) {
                            // Formata os valores monetários ao carregar
                            const valorNumerico = parseFloat(data[input.id]) || 0;
                            if (valorNumerico === 0) {
                                input.value = '';
                            } else {
                                input.value = valorNumerico.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                        } else {
                            input.value = data[input.id];
                        }
                    }
                });

                // Carrega o estado do checkbox ordemChegada
                const ordemChegadaCheckbox = document.getElementById('ordemChegada');
                if (ordemChegadaCheckbox && data.ordemChegada !== undefined) {
                    ordemChegadaCheckbox.checked = data.ordemChegada;
                }

                toggleDateFields();
                toggleMarcaFields();
                toggleMovelFields();
            } else {
                // Garante que os campos de moeda tenham valor padrão se não houver dados salvos
                if (valorInicialInput) valorInicialInput.value = '';
                if (valorNegociadoInput) valorNegociadoInput.value = '';
                if (valorDeslocamentoInput) valorDeslocamentoInput.value = '';
            }
        }

        function clearFormData() {
            const keepAcessorios = isAcessoriosCheckbox.checked;

            form.reset();

            // Limpa os campos de moeda com formato garantido
            if (valorInicialInput) valorInicialInput.value = '';
            if (valorNegociadoInput) valorNegociadoInput.value = '';
            if (valorDeslocamentoInput) valorDeslocamentoInput.value = '';
            isAcessoriosCheckbox.checked = keepAcessorios;


            if (resultadoTextarea) resultadoTextarea.value = '';
            localStorage.removeItem('negociacaoFormData');

            // restaura o estado do checkbox #Acessorios
            isAcessoriosCheckbox.checked = keepAcessorios;
            toggleMarcaFields();

            toggleDateFields();
            toggleMovelFields();

            showToast('Formulário limpo com sucesso!', 'success');
        }

        function generateMessage() {
            console.log('Gerando mensagem...');

            allFormInputs.forEach(i => i.classList.remove('invalid'));

            let isValid = true;
            const requiredFields = ['status', 'prestador', 'valorInicial', 'valorNegociado', 'whatsapp'];

            requiredFields.forEach(id => {
                const field = document.getElementById(id);
                if (field && !field.value.trim()) {
                    field.classList.add('invalid');
                    isValid = false;
                }
            });

            const marcaField = isAcessoriosCheckbox.checked ? marcaAcessoriosSelect : marcaVidrosSelect;
            if (marcaField && !marcaField.value) {
                marcaField.classList.add('invalid');
                isValid = false;
            }

            const data = {};
            allFormInputs.forEach(i => {
                if (i.id) {
                    if (i.type === 'checkbox') {
                        data[i.id] = i.checked;
                    } else if (['valorInicial', 'valorNegociado', 'valorDeslocamento'].includes(i.id)) {
                        data[i.id] = parseMoedaParaNumero(i.value);
                    } else {
                        data[i.id] = i.value;
                    }
                }
            });

            // Adiciona o checkbox ordemChegada aos dados
            const ordemChegadaCheckbox = document.getElementById('ordemChegada');
            if (ordemChegadaCheckbox) {
                data.ordemChegada = ordemChegadaCheckbox.checked;
            }

            if (data.status === 'DISPONÍVEL' && !data.agendamento1) {
                const agendamento1 = document.getElementById('agendamento1');
                if (agendamento1) {
                    agendamento1.classList.add('invalid');
                    isValid = false;
                }
            }
            if (data.status === 'INDISPONÍVEL' && !data.prevChegada) {
                const prevChegada = document.getElementById('prevChegada');
                if (prevChegada) {
                    prevChegada.classList.add('invalid');
                    isValid = false;
                }
            }
            if (!isValid) {
                showToast('Preencha todos os campos obrigatórios!', 'error');
                return;
            }

            let message = `Equipe de Negociação VFLR 🚘🚗:– ATENDIMENTO LIBERADO`;
            message += data.cMovel ? ` C/ MÓVEL` : '';
            message += ` – prestador: ${data.prestador || 'Não informado'}`;
            message += ` - ${data.responsavel || 'Não Informado'}`;
            message += ` via WhatsApp: ${data.whatsapp || 'Não Informado'}`;

            const valorInicial = data.valorInicial || 0;
            const valorNegociado = data.valorNegociado || 0;
            const valorDeslocamento = data.valorDeslocamento || 0;

            message += `, Valor inicial: ${formatCurrency(valorInicial)}`;
            message += `, negociado no valor de: ${formatCurrency(valorNegociado)}`;

            if (data.cMovel) {
                if (data.cortesia) {
                    message += ` com deslocamento a CORTESIA`;
                } else {
                    message += ` com deslocamento de ${formatCurrency(valorDeslocamento)}`;
                    message += ` total: ${formatCurrency(valorNegociado + valorDeslocamento)}`;
                }
            }

            const marca = data.isAcessorios ? data.marca_acessorios : data.marca_vidros;
            message += `, Marca: ${marca || 'Não informada'}`;

            if (data.status === 'DISPONÍVEL') {
                const datasAgendamento = [data.agendamento1, data.agendamento2, data.agendamento3]
                    .filter(d => d)
                    .map(formatDateShort)
                    .join(' | ');

                message += ` - DISPONÍVEL. Agendamento: ${datasAgendamento}`;

                // ADICIONA INFORMAÇÃO DE ORDEM DE CHEGADA SE MARCADO
                if (data.ordemChegada) {
                    message += ` - ORDEM DE CHEGADA`;
                }

                message += `;`;

            } else if (data.status === 'INDISPONÍVEL') {
                const diasUteis = calculateBusinessDays(data.prevChegada);
                const plural = diasUteis === 1 ? "dia útil" : "dias úteis";
                message += ` - INDISPONÍVEL. Previsão de chegada: ${diasUteis} ${plural};`;
            }

            if (resultadoTextarea) {
                resultadoTextarea.value = message;
            }
            showToast('Mensagem gerada com sucesso!', 'success');
        }

        function copyMessage() {
            if (resultadoTextarea && resultadoTextarea.value) {
                navigator.clipboard.writeText(resultadoTextarea.value)
                    .then(() => showToast('Mensagem copiada para a área de transferência!', 'success'))
                    .catch(() => showToast('Falha ao copiar a mensagem!', 'error'));
            } else {
                showToast('Nenhuma mensagem para copiar!', 'error');
            }
        }

        if (statusSelect) statusSelect.addEventListener('change', toggleDateFields);
        if (isAcessoriosCheckbox) isAcessoriosCheckbox.addEventListener('change', toggleMarcaFields);
        if (cMovelCheckbox) cMovelCheckbox.addEventListener('change', toggleMovelFields);
        if (cortesiaCheckbox) cortesiaCheckbox.addEventListener('change', toggleMovelFields);

        if (btnGenerate) btnGenerate.addEventListener('click', generateMessage);
        if (btnCopy) btnCopy.addEventListener('click', copyMessage);
        if (btnClear) btnClear.addEventListener('click', clearFormData);

        form.addEventListener('input', saveFormData);

        if (marcaAcessoriosSelect) populateSelect(marcaAcessoriosSelect, marcas.acessorios);
        if (marcaVidrosSelect) populateSelect(marcaVidrosSelect, marcas.vidros);

        setupAutocomplete();
        loadFormData();

        console.log('✅ Módulo de negociação inicializado');
    }
    }