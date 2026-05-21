let estaVinculado = false;
let conectando = false;
let procesoEnCurso = false;

function setSaludo() {
    const hora = new Date().getHours();
    const saludoText = document.getElementById('text-saludo');
    if (hora >= 6 && hora < 12) {
        saludoText.innerText = "Buenos días";
    } else if (hora >= 12 && hora < 19) {
        saludoText.innerText = "Buenas tardes";
    } else {
        saludoText.innerText = "Buenas noches";
    }
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.drawer-item').forEach(item => item.classList.remove('active'));
    if(pageId === 'home-page') document.querySelectorAll('.drawer-item')[0].classList.add('active');
    if(pageId === 'recompensas-page') document.querySelectorAll('.drawer-item')[1].classList.add('active');
    if(pageId === 'empresas-page') document.querySelectorAll('.drawer-item')[2].classList.add('active');

    closeDrawer();
}

function login() {
    navigateTo('home-page');
    setSaludo();
}

function logout() {
    estaVinculado = false;
    procesoEnCurso = false;
    resetIoTCard();
    resetGaugesYCharts();
    navigateTo('login-page');
}

function toggleDrawer() {
    document.getElementById('side-drawer').classList.toggle('open');
    document.getElementById('drawer-overlay').classList.toggle('open');
}

function closeDrawer() {
    document.getElementById('side-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
}

function showToast(message) {
    const snackbar = document.getElementById('snackbar');
    snackbar.innerText = message;
    snackbar.classList.add('show');
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
}

function handleIoTAction() {
    if (!estaVinculado) {
        if (conectando) return;
        vincularBote();
    } else {
        if (procesoEnCurso) return;
        iniciarProceso();
    }
}

async function vincularBote() {
    conectando = true;
    const statusText = document.getElementById('status-text');
    const btnIot = document.getElementById('btn-iot');
    
    statusText.innerText = "Escaneando red Wi-Fi del contenedor (ESP32 IoT)...";
    btnIot.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 2000));
    statusText.innerText = "Sincronizando dirección IP y sensores de gas de la app...";
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    estaVinculado = true;
    conectando = false;
    
    statusText.innerText = "Dispositivo conectado por Wi-Fi local";
    btnIot.disabled = false;
    btnIot.classList.add('btn-iot-connected');
    document.getElementById('btn-iot-text').innerText = "Registrar Descarga de Residuos";
}

async function iniciarProceso() {
    procesoEnCurso = true;
    const statusText = document.getElementById('status-text');
    const percentageText = document.getElementById('status-percentage');
    const progressContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const btnIot = document.getElementById('btn-iot');

    btnIot.disabled = true;
    statusText.innerText = "Analizando entrada: +2.0 kg de materia orgánica";
    await new Promise(resolve => setTimeout(resolve, 1000));

    statusText.innerText = "Motor activado: Mezclando y aislando metano...";
    percentageText.style.display = "inline";
    progressContainer.style.display = "block";

    for (let i = 0; i <= 100; i += 5) {
        progressBar.style.width = i + '%';
        percentageText.innerText = i + '%';
        await new Promise(resolve => setTimeout(resolve, 60));
    }

    actualizarGauges(2.0, 1.0, 0.4);
    actualizarGraficaJueves();

    statusText.innerText = "Procesamiento finalizado. Composta generada.";
    percentageText.style.display = "none";
    progressContainer.style.display = "none";
    btnIot.disabled = false;
    procesoEnCurso = false;
}

function actualizarGauges(basura, co2, metano) {
    const maxBasura = 5, maxCO2 = 3, maxMetano = 2;

    const dashBasura = (basura / maxBasura) * 126;
    const rotBasura = (basura / maxBasura) * 180;
    document.getElementById('gauge-fill-basura').style.strokeDasharray = `${dashBasura}, 126`;
    document.getElementById('needle-basura').style.transform = `rotate(${rotBasura}deg)`;
    document.getElementById('val-basura').innerText = `${basura.toFixed(1)} kg`;

    const dashCO2 = (co2 / maxCO2) * 126;
    const rotCO2 = (co2 / maxCO2) * 180;
    document.getElementById('gauge-fill-co2').style.strokeDasharray = `${dashCO2}, 126`;
    document.getElementById('needle-co2').style.transform = `rotate(${rotCO2}deg)`;
    document.getElementById('val-co2').innerText = `${co2.toFixed(1)} kg`;

    const dashMetano = (metano / maxMetano) * 126;
    const rotMetano = (metano / maxMetano) * 180;
    document.getElementById('gauge-fill-metano').style.strokeDasharray = `${dashMetano}, 126`;
    document.getElementById('needle-metano').style.transform = `rotate(${rotMetano}deg)`;
    document.getElementById('val-metano').innerText = `${metano.toFixed(1)} kg`;
}

function actualizarGraficaJueves() {
    document.getElementById('jue-tag').style.visibility = "visible";
    document.getElementById('bar-jue-1').style.height = "50px";
    document.getElementById('bar-jue-2').style.height = "35px";
    document.getElementById('bar-jue-3').style.height = "20px";
}

function resetIoTCard() {
    const btnIot = document.getElementById('btn-iot');
    document.getElementById('status-text').innerText = "Dispositivo desvinculado";
    document.getElementById('btn-iot-text').innerText = "Vincular dispositivo Bin Smartclean";
    btnIot.classList.remove('btn-iot-connected');
    document.getElementById('progress-bar-container').style.display = "none";
    document.getElementById('status-percentage').style.display = "none";
    btnIot.disabled = false;
}

function resetGaugesYCharts() {
    actualizarGauges(0, 0, 0);
    document.getElementById('jue-tag').style.visibility = "hidden";
    document.getElementById('bar-jue-1').style.height = "4px";
    document.getElementById('bar-jue-2').style.height = "4px";
    document.getElementById('bar-jue-3').style.height = "4px";
}