// ======================================================================
// FIREBASE
// ======================================================================

const firebaseConfig = {
    apiKey: "AIzaSyAXkIauvsc7tcXOOemS2Tow5yP3hLWz3Ak",
    authDomain: "ramo5-ctm.firebaseapp.com",
    projectId: "ramo5-ctm",
    storageBucket: "ramo5-ctm.firebasestorage.app",
    messagingSenderId: "890316894866",
    appId: "1:890316894866:web:514fc4f745b94ff3326c4b",
    measurementId: "G-FZ7B22LS0D"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const COLLECTION = "reunioes_ramo5";


// ======================================================================
// TESTE DE CONEXÃO
// ======================================================================

const statusEl = document.getElementById('conn-status');

db.collection(COLLECTION)
    .limit(1)
    .get()
    .then(() => {
        statusEl.textContent = 'Conectado — dados salvos no Firebase';
        statusEl.className = 'rs-status online';
    })
    .catch((err) => {
        statusEl.textContent = 'Erro de conexão: ' + err.message;
        statusEl.className = 'rs-status offline';
        console.error(err);
    });


// ======================================================================
// APLICAÇÃO
// ======================================================================

(function() {

    // ================================================================
    // CRIAÇÃO DOS ORADORES
    // ================================================================

    const discursoLabels1a4 = [
        "Primeiro Orador(a) (Elder/Sister)",
        "Segundo Orador(a) (Elder/Sister)",
        "Terceiro Orador(a) (Elder/Sister)",
        "Quarto Orador(a) (Elder/Sister)"
    ];

    const wrap1a4 = document.getElementById('f-discursos-1a4');

    discursoLabels1a4.forEach((label, i) => {

        const row = document.createElement('div');

        row.className = 'rs-discurso-row';

        row.innerHTML =
            '<div class="rs-discurso-num">' + (i + 1) + '</div>' +
            '<input type="text" class="f-discurso" data-idx="' + i + '" placeholder="' + label + '" />';

        wrap1a4.appendChild(row);
    });


    const wrap5 = document.getElementById('f-discurso-5');

    wrap5.innerHTML =
        '<div class="rs-discurso-row">' +
        '<div class="rs-discurso-num">5</div>' +
        '<input type="text" class="f-discurso" data-idx="4" placeholder="Quinto Orador(a)" />' +
        '</div>';


    // ================================================================
    // TIPO DE REUNIÃO
    // ================================================================

    const blocoDiscursos = document.getElementById('bloco-discursos');
    const blocoTestemunhos = document.getElementById('bloco-testemunhos');

    function getTipoReuniao() {

        return document.querySelector(
            'input[name="tipo-reuniao"]:checked'
        ).value;

    }


    function atualizarTipoReuniao() {

        const tipo = getTipoReuniao();

        if (tipo === 'testemunho') {

            blocoDiscursos.style.display = 'none';
            blocoTestemunhos.style.display = '';

        } else {

            blocoDiscursos.style.display = '';
            blocoTestemunhos.style.display = 'none';

        }

    }


    document
        .querySelectorAll('input[name="tipo-reuniao"]')
        .forEach(radio => {

            radio.addEventListener(
                'change',
                atualizarTipoReuniao
            );

        });


    atualizarTipoReuniao();


    // ================================================================
    // ABAS
    // ================================================================

    const tabs = document.querySelectorAll('.rs-tab');

    const viewForm = document.getElementById('rs-view-form');

    const viewHistory = document.getElementById('rs-view-history');


    tabs.forEach(t => {

        t.addEventListener('click', () => {

            tabs.forEach(x =>
                x.classList.remove('active')
            );

            t.classList.add('active');


            if (t.dataset.tab === 'form') {

                viewForm.style.display = '';
                viewHistory.style.display = 'none';

            } else {

                viewForm.style.display = 'none';
                viewHistory.style.display = '';

                loadHistory();

            }

        });

    });


    // ================================================================
    // DATA
    // ================================================================

    function todayISO() {

        const d = new Date();

        return d.getFullYear() +
            '-' +
            String(d.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(d.getDate()).padStart(2, '0');

    }


    document.getElementById('f-date').value = todayISO();


    // ================================================================
    // COLETAR FORMULÁRIO
    // ================================================================

    function collectForm() {

        const tipo = getTipoReuniao();


        return {

            date: document.getElementById('f-date').value,

            tipoReuniao: tipo,

            preludio: document.getElementById('f-preludio').value.trim(),

            dirigidoPor: document.getElementById('f-dirigido').value.trim(),

            presididoPor: document.getElementById('f-presidido').value.trim(),

            regente: document.getElementById('f-regente').value.trim(),

            reconhecimentos: document.getElementById('f-reconhecimentos').value.trim(),

            anuncios: document.getElementById('f-anuncios').value.trim(),

            hinoAbertura: document.getElementById('f-hino-abertura').value.trim(),

            oracaoAbertura: document.getElementById('f-oracao-abertura').value.trim(),

            hinoSacramental: document.getElementById('f-hino-sacramental').value.trim(),


            discursos: tipo === 'normal' ?
                Array.from(
                    document.querySelectorAll('.f-discurso')
                ).map(el => el.value.trim()) : [],


            numeroMusical: tipo === 'normal' ?
                document.getElementById('f-numero-musical').value.trim() : '',


            testemunhos: tipo === 'testemunho' ?
                document.getElementById('f-testemunhos').value.trim() : '',


            hinoEncerramento: document.getElementById('f-hino-encerramento').value.trim(),

            oracaoEncerramento: document.getElementById('f-oracao-encerramento').value.trim()

        };

    }


    // ================================================================
    // PREENCHER FORMULÁRIO
    // ================================================================

    function fillForm(entry) {

        document.getElementById('f-date').value =
            entry.date || todayISO();


        const tipo =
            entry.tipoReuniao || 'normal';


        document.querySelector(
            'input[name="tipo-reuniao"][value="' + tipo + '"]'
        ).checked = true;


        atualizarTipoReuniao();


        document.getElementById('f-preludio').value =
            entry.preludio || '';

        document.getElementById('f-dirigido').value =
            entry.dirigidoPor || '';

        document.getElementById('f-presidido').value =
            entry.presididoPor || '';

        document.getElementById('f-regente').value =
            entry.regente || '';

        document.getElementById('f-reconhecimentos').value =
            entry.reconhecimentos || '';

        document.getElementById('f-anuncios').value =
            entry.anuncios || '';

        document.getElementById('f-hino-abertura').value =
            entry.hinoAbertura || '';

        document.getElementById('f-oracao-abertura').value =
            entry.oracaoAbertura || '';

        document.getElementById('f-hino-sacramental').value =
            entry.hinoSacramental || '';


        // Discursos

        const discursoEls =
            document.querySelectorAll('.f-discurso');

        discursoEls.forEach((el, i) => {

            el.value =
                (entry.discursos &&
                    entry.discursos[i]) || '';

        });


        document.getElementById('f-numero-musical').value =
            entry.numeroMusical || '';


        // Testemunhos

        document.getElementById('f-testemunhos').value =
            entry.testemunhos || '';


        document.getElementById('f-hino-encerramento').value =
            entry.hinoEncerramento || '';

        document.getElementById('f-oracao-encerramento').value =
            entry.oracaoEncerramento || '';

    }


    // ================================================================
    // LIMPAR FORMULÁRIO
    // ================================================================

    function clearForm() {

        document.getElementById('f-date').value =
            todayISO();


        document.querySelector(
            'input[name="tipo-reuniao"][value="normal"]'
        ).checked = true;


        document.querySelector(
            'input[name="tipo-reuniao"][value="testemunho"]'
        ).checked = false;


        document.getElementById('f-preludio').value = '';

        document.getElementById('f-dirigido').value = '';

        document.getElementById('f-presidido').value = '';

        document.getElementById('f-regente').value = '';

        document.getElementById('f-reconhecimentos').value = '';

        document.getElementById('f-anuncios').value = '';

        document.getElementById('f-hino-abertura').value = '';

        document.getElementById('f-oracao-abertura').value = '';

        document.getElementById('f-hino-sacramental').value = '';


        document.querySelectorAll('.f-discurso')
            .forEach(el => el.value = '');


        document.getElementById('f-numero-musical').value = '';

        document.getElementById('f-testemunhos').value = '';

        document.getElementById('f-hino-encerramento').value = '';

        document.getElementById('f-oracao-encerramento').value = '';


        atualizarTipoReuniao();

    }


    document
        .getElementById('btn-clear')
        .addEventListener('click', clearForm);


    // ================================================================
    // MENSAGENS
    // ================================================================

    function showMsg(text, ok) {

        const el =
            document.getElementById('f-msg');

        el.textContent = text;

        el.className =
            'rs-msg ' +
            (ok ? 'ok' : 'err');


        setTimeout(() => {

            el.className = 'rs-msg';

        }, 3500);

    }


    // ================================================================
    // DATA FORMATADA
    // ================================================================

    function formatDate(iso) {

        if (!iso) return '';

        const [y, m, d] =
        iso.split('-');

        return d + '/' + m + '/' + y;

    }


    // ================================================================
    // SALVAR REUNIÃO
    // ================================================================

    document
        .getElementById('btn-save')
        .addEventListener('click', async () => {

            const entry = collectForm();


            if (!entry.date) {

                showMsg(
                    'Informe a data da reunião antes de salvar.',
                    false
                );

                return;

            }


            const btn =
                document.getElementById('btn-save');


            btn.disabled = true;


            try {

                await db
                    .collection(COLLECTION)
                    .doc(entry.date)
                    .set(entry);


                showMsg(
                    'Reunião de ' +
                    formatDate(entry.date) +
                    ' salva no histórico.',
                    true
                );


                // LIMPA O FORMULÁRIO APÓS SALVAR

                clearForm();


            } catch (err) {

                showMsg(
                    'Erro ao salvar: ' +
                    err.message,
                    false
                );

            } finally {

                btn.disabled = false;

            }

        });


    // ================================================================
    // HISTÓRICO
    // ================================================================

    async function loadHistory() {

        const listEl =
            document.getElementById('hist-list');


        listEl.innerHTML =
            '<div class="rs-loading">Carregando histórico…</div>';


        try {

            const snapshot =
                await db
                .collection(COLLECTION)
                .orderBy('date', 'desc')
                .get();


            if (snapshot.empty) {

                listEl.innerHTML =
                    '<div class="rs-hist-empty">' +
                    'Nenhuma reunião salva ainda.<br/>' +
                    'Preencha o formulário e clique em "Salvar reunião".' +
                    '</div>';

                return;

            }


            const entries = [];

            snapshot.forEach(doc => {

                entries.push(doc.data());

            });


            renderHistory(entries);


        } catch (err) {

            listEl.innerHTML =
                '<div class="rs-hist-empty">' +
                'Erro ao carregar histórico: ' +
                err.message +
                '</div>';

        }

    }


    // ================================================================
    // LINHA DO HISTÓRICO
    // ================================================================

    function fieldRow(label, value) {

        if (!value) return '';


        return (
            '<div class="rs-hist-row">' +
            '<div class="rs-hist-label">' +
            label +
            '</div>' +
            '<div class="rs-hist-val">' +
            escapeHtml(value) +
            '</div>' +
            '</div>'
        );

    }


    // ================================================================
    // ESCAPAR HTML
    // ================================================================

    function escapeHtml(s) {

        return String(s).replace(
            /[&<>"']/g,
            c => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            } [c])
        );

    }


    // ================================================================
    // GERAR PDF
    // ================================================================

    function gerarPDF(entry) {

        const {
            jsPDF
        } = window.jspdf;

        const pdf = new jsPDF();


        const margem = 20;

        const largura = 170;

        let y = 20;


        const isTestemunho =
            entry.tipoReuniao === 'testemunho';


        // ------------------------------------------------------------
        // SEÇÃO
        // ------------------------------------------------------------

        function secao(texto) {

            y += 5;

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(12);

            pdf.setTextColor(
                31,
                58,
                95
            );

            pdf.text(
                texto,
                margem,
                y
            );

            y += 7;

        }


        // ------------------------------------------------------------
        // CAMPO
        // ------------------------------------------------------------

        function campo(label, valor) {

            if (!valor) return;


            const linhas =
                pdf.splitTextToSize(
                    String(valor),
                    largura
                );


            const alturaNecessaria =
                5 +
                (linhas.length * 5) +
                8;


            if (y + alturaNecessaria > 270) {

                pdf.addPage();

                y = 20;

            }


            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(10);

            pdf.setTextColor(
                107,
                104,
                95
            );


            pdf.text(
                label,
                margem,
                y
            );


            y += 5;


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(11);

            pdf.setTextColor(
                42,
                42,
                40
            );


            pdf.text(
                linhas,
                margem,
                y
            );


            y +=
                linhas.length * 5 +
                3;

        }


        // ============================================================
        // CABEÇALHO
        // ============================================================

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(18);

        pdf.setTextColor(
            31,
            58,
            95
        );


        pdf.text(
            "Ramo 5 · CTM",
            margem,
            y
        );


        y += 8;


        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
            107,
            104,
            95
        );


        pdf.text(
            isTestemunho ?
            "Reunião de Testemunho" :
            "Reunião Sacramental",
            margem,
            y
        );


        y += 7;


        pdf.setDrawColor(
            184,
            146,
            63
        );

        pdf.setLineWidth(0.7);


        pdf.line(
            margem,
            y,
            190,
            y
        );


        y += 10;


        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(14);

        pdf.setTextColor(
            31,
            58,
            95
        );


        pdf.text(
            isTestemunho ?
            "Ata da Reunião de Testemunho" :
            "Ata da Reunião Sacramental",
            margem,
            y
        );


        y += 8;


        campo(
            "Data",
            formatDate(entry.date)
        );


        // ============================================================
        // ABERTURA
        // ============================================================

        secao("Abertura");


        campo(
            "Prelúdio musical",
            entry.preludio
        );


        campo(
            "Dirigido por",
            entry.dirigidoPor
        );


        campo(
            "Presidido por",
            entry.presididoPor
        );


        campo(
            "Regente",
            entry.regente
        );


        campo(
            "Reconhecimentos",
            entry.reconhecimentos
        );


        campo(
            "Anúncios",
            entry.anuncios
        );


        campo(
            "Hino de abertura",
            entry.hinoAbertura
        );


        campo(
            "Oração de abertura",
            entry.oracaoAbertura
        );


        campo(
            "Hino sacramental",
            entry.hinoSacramental
        );


        // ============================================================
        // DISCURSOS / TESTEMUNHOS
        // ============================================================

        if (isTestemunho) {

            secao("Testemunhos");


            campo(
                "Membros que prestaram testemunho",
                entry.testemunhos
            );


        } else {

            secao(
                "Discursos e Número Musical"
            );


            const discursos =
                entry.discursos || [];


            campo(
                "Primeiro orador(a)",
                discursos[0]
            );


            campo(
                "Segundo orador(a)",
                discursos[1]
            );


            campo(
                "Terceiro orador(a)",
                discursos[2]
            );


            campo(
                "Quarto orador(a)",
                discursos[3]
            );


            campo(
                "Número musical especial",
                entry.numeroMusical
            );


            campo(
                "Quinto orador(a)",
                discursos[4]
            );

        }


        // ============================================================
        // ENCERRAMENTO
        // ============================================================

        secao("Encerramento");


        campo(
            "Hino de encerramento",
            entry.hinoEncerramento
        );


        campo(
            "Oração de encerramento",
            entry.oracaoEncerramento
        );


        // ============================================================
        // RODAPÉ
        // ============================================================

        const totalPaginas =
            pdf.internal.getNumberOfPages();


        for (
            let i = 1; i <= totalPaginas; i++
        ) {

            pdf.setPage(i);


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(8);

            pdf.setTextColor(
                107,
                104,
                95
            );


            pdf.text(
                "Agenda Sacramental · Ramo 5 · CTM",
                margem,
                287
            );


            pdf.text(
                "Página " +
                i +
                " de " +
                totalPaginas,
                190,
                287, {
                    align: "right"
                }
            );

        }


        pdf.save(
            "ata-reuniao-ramo5-" +
            entry.date +
            ".pdf"
        );

    }


    // ================================================================
    // HISTÓRICO — RENDERIZAR
    // ================================================================

    function renderHistory(entries) {

        const listEl =
            document.getElementById('hist-list');
        listEl.innerHTML = '';
        entries.forEach(entry => {

            const card =
                document.createElement('div');


            card.className =
                'rs-hist-card';


            const isTestemunho =
                entry.tipoReuniao === 'testemunho';


            const discursosCount =
                (entry.discursos || [])
                .filter(Boolean)
                .length;


            const tipoTexto =
                isTestemunho ?
                'Reunião de Testemunho' :
                'Reunião Sacramental';


            const resumo =
                isTestemunho ?
                tipoTexto :
                (
                    (entry.dirigidoPor ?
                        'Dirigido por: ' +
                        escapeHtml(entry.dirigidoPor) +
                        ' · ' :
                        '') +
                    discursosCount +
                    ' orador(es)'
                );


            card.innerHTML =
                '<div class="rs-hist-head">' +
                '<div>' +
                '<div class="rs-hist-date">' + formatDate(entry.date) + '</div>' +
                '<div class="rs-hist-sub">' +
                (isTestemunho ?
                    'Reunião de Testemunho' :
                    'Reunião Sacramental') +
                '</div>' +
                '</div>' +
                '<div class="rs-hist-chevron">&#9662;</div>' +
                '</div>' +

                '<div class="rs-hist-body">' +

                fieldRow('Tipo de reunião',
                    isTestemunho ? 'Reunião de Testemunho' : 'Reunião Sacramental') +


                fieldRow(
                    'Prelúdio musical',
                    entry.preludio
                ) +


                fieldRow(
                    'Dirigido por',
                    entry.dirigidoPor
                ) +


                fieldRow(
                    'Presidido por',
                    entry.presididoPor
                ) +


                fieldRow(
                    'Regente',
                    entry.regente
                ) +


                fieldRow(
                    'Reconhecimentos',
                    entry.reconhecimentos
                ) +


                fieldRow(
                    'Anúncios',
                    entry.anuncios
                ) +


                fieldRow(
                    'Hino de abertura',
                    entry.hinoAbertura
                ) +


                fieldRow(
                    'Oração de abertura',
                    entry.oracaoAbertura
                ) +


                fieldRow(
                    'Hino sacramental',
                    entry.hinoSacramental
                ) +


                (
                    isTestemunho

                    ?
                    fieldRow(
                        'Testemunhos',
                        entry.testemunhos
                    )

                    :
                    (
                        fieldRow(
                            'Primeiro orador(a)',
                            entry.discursos &&
                            entry.discursos[0]
                        ) +

                        fieldRow(
                            'Segundo orador(a)',
                            entry.discursos &&
                            entry.discursos[1]
                        ) +

                        fieldRow(
                            'Terceiro orador(a)',
                            entry.discursos &&
                            entry.discursos[2]
                        ) +

                        fieldRow(
                            'Quarto orador(a)',
                            entry.discursos &&
                            entry.discursos[3]
                        ) +

                        fieldRow(
                            'Número musical especial',
                            entry.numeroMusical
                        ) +

                        fieldRow(
                            'Quinto orador(a)',
                            entry.discursos &&
                            entry.discursos[4]
                        )
                    )
                ) +


                fieldRow(
                    'Hino de encerramento',
                    entry.hinoEncerramento
                ) +


                fieldRow(
                    'Oração de encerramento',
                    entry.oracaoEncerramento
                ) +


                '<div class="rs-hist-actions">' +

                '<button class="btn-edit">' +
                'Editar' +
                '</button>' +

                '<button class="btn-pdf">' +
                'Baixar PDF' +
                '</button>' +

                '<button class="btn-delete danger">' +
                'Excluir' +
                '</button>' +

                '</div>' +

                '</div>';


            // ========================================================
            // ABRIR / FECHAR HISTÓRICO
            // ========================================================

            const head =
                card.querySelector(
                    '.rs-hist-head'
                );


            const body =
                card.querySelector(
                    '.rs-hist-body'
                );


            const chevron =
                card.querySelector(
                    '.rs-hist-chevron'
                );


            head.addEventListener(
                'click',
                () => {

                    const open =
                        body.classList.toggle(
                            'open'
                        );


                    chevron.style.transform =
                        open ?
                        'rotate(180deg)' :
                        'rotate(0deg)';

                }
            );


            // ========================================================
            // EDITAR
            // ========================================================

            card
                .querySelector('.btn-edit')
                .addEventListener(
                    'click',
                    (e) => {

                        e.stopPropagation();


                        fillForm(entry);


                        document
                            .querySelector(
                                '.rs-tab[data-tab="form"]'
                            )
                            .click();


                        showMsg(
                            'Reunião de ' +
                            formatDate(entry.date) +
                            ' carregada para edição.',
                            true
                        );

                    }
                );


            // ========================================================
            // PDF
            // ========================================================

            card
                .querySelector('.btn-pdf')
                .addEventListener(
                    'click',
                    (e) => {

                        e.stopPropagation();

                        gerarPDF(entry);

                    }
                );


            // ========================================================
            // EXCLUIR
            // ========================================================

            card
                .querySelector('.btn-delete')
                .addEventListener(
                    'click',
                    async (e) => {
                        e.stopPropagation();

                        if (
                            !confirm(
                                'Excluir a reunião de ' +
                                formatDate(entry.date) +
                                ' do histórico?'
                            )
                        ) {
                            return;
                        }

                        try {
                            await db
                                .collection(COLLECTION)
                                .doc(entry.date)
                                .delete();
                            loadHistory();

                        } catch (err) {
                            alert(
                                'Erro ao excluir: ' +
                                err.message
                            );
                        }
                    }
                );
            listEl.appendChild(card);
        });
    }
})();