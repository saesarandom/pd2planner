class DPSSimulator {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.createUI();
        this.setupObservers();
    }

    createUI() {
        // Create container for DPS display
        const container = document.createElement('div');
        container.id = 'dps-display';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            font-family: monospace;
            z-index: 1000;
        `;

        // Create DPS text display
        const dpsText = document.createElement('div');
        dpsText.id = 'current-dps';
        dpsText.textContent = 'DPS: 0';

        // Create control button
        const controlButton = document.createElement('button');
        controlButton.id = 'dps-control';
        controlButton.textContent = 'Start DPS';
        controlButton.style.cssText = `
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            border: none;
            color: white;
            border-radius: 3px;
            cursor: pointer;
        `;

        container.appendChild(dpsText);
        container.appendChild(controlButton);
        document.body.appendChild(container);

        // Add event listener to button
        controlButton.addEventListener('click', () => {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    setupObservers() {
        // Observe changes in damage containers
        const minDmgContainer = document.getElementById('onehandmindmgcontainer');
        const maxDmgContainer = document.getElementById('onehandmaxdmgcontainer');

        const observer = new MutationObserver(() => {
            if (this.isRunning) {
                this.restart();
            }
        });

        const observerConfig = {
            childList: true,
            characterData: true,
            subtree: true
        };

        if (minDmgContainer) observer.observe(minDmgContainer, observerConfig);
        if (maxDmgContainer) observer.observe(maxDmgContainer, observerConfig);
    }

    calculateDPS() {
        const minDmg = parseInt(document.getElementById('onehandmindmgcontainer')?.textContent || 0);
        const maxDmg = parseInt(document.getElementById('onehandmaxdmgcontainer')?.textContent || 0);
        const critChance = parseFloat(document.getElementById('criticalhitcontainer')?.value || 0) / 100;
        const critMultiplier = parseFloat(document.getElementById('crithitmultipliercontainer')?.textContent || 1);

        let totalDamage = 0;
        const iterations = 100; // Number of hits to average

        for (let i = 0; i < iterations; i++) {
            let damage = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
            
            // Apply critical hit
            if (Math.random() < critChance) {
                damage *= critMultiplier;
            }
            
            totalDamage += damage;
        }

        return Math.floor(totalDamage / iterations);
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('dps-control').textContent = 'Stop DPS';
        document.getElementById('dps-control').style.backgroundColor = '#f44336';

        this.intervalId = setInterval(() => {
            const dps = this.calculateDPS();
            document.getElementById('current-dps').textContent = `DPS: ${dps}`;
        }, 100);
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        document.getElementById('dps-control').textContent = 'Start DPS';
        document.getElementById('dps-control').style.backgroundColor = '#4CAF50';
    }

    restart() {
        this.stop();
        this.start();
    }
}

// Initialize the simulator when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dpsSimulator = new DPSSimulator();
});