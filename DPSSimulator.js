class DPSSimulator {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.observer = null;
        this.debounceTimeout = null;
        this.createUI();
        this.setupObservers();
    }
 
    createUI() {
        const container = document.createElement('div');
        container.id = 'dps-display';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            font-family: monospace;
        `;
 
        const dpsText = document.createElement('div');
        dpsText.id = 'current-dps';
        dpsText.textContent = 'DPS: 0';
 
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
 
        controlButton.addEventListener('click', () => {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
 
    setupObservers() {
        const damageOutput = document.getElementById('damageOutput');
        const containers = [
            'helms-dropdown', 'armors-dropdown', 'weapons-dropdown', 
            'offs-dropdown', 'gloves-dropdown', 'belts-dropdown', 
            'boots-dropdown', 'ringsone-dropdown', 'ringstwo-dropdown', 
            'amulets-dropdown'
        ];
        
        if (this.observer) {
            this.observer.disconnect();
        }
     
        this.observer = new MutationObserver(this.handleDamageChange.bind(this));
        
        if (damageOutput) {
            this.observer.observe(damageOutput, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
     
        // Add container change listeners
        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    if (!this.isRunning) {
                        this.updateDPS();
                    }
                });
            }
        });
     
        // Strength input listener
        const strInput = document.getElementById('straccr');
        if (strInput) {
            strInput.addEventListener('input', () => {
                if (!this.isRunning) {
                    this.updateDPS();
                }
            });
        }
     }
 
    handleDamageChange(mutations) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        
        this.debounceTimeout = setTimeout(() => {
            if (this.isRunning) {
                this.updateDPS();
            }
        }, 100);
    }
 
    parseDamageRange(damageText) {
        const [min, max] = damageText.split('-').map(num => parseInt(num.trim()));
        return { min: min || 0, max: max || 0 };
    }
 
    calculateDPS() {
        const damageText = document.getElementById('damageOutput')?.textContent || '0-0';
        const { min: minDmg, max: maxDmg } = this.parseDamageRange(damageText);
        const critChance = parseFloat(document.getElementById('criticalhitcontainer')?.value || 0) / 100;
        const critMultiplier = parseFloat(document.getElementById('crithitmultipliercontainer')?.textContent || 1);
        const attacksPerSecond = 1; // Could be modified based on attack speed
 
        let totalDamage = 0;
        const iterations = 1; // Increased for more accurate average
 
        for (let i = 0; i < iterations; i++) {
            let damage = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
            
            if (Math.random() < critChance) {
                damage *= critMultiplier;
            }
            
            totalDamage += damage;
        }
 
        return Math.floor((totalDamage / iterations) * attacksPerSecond);
    }
 
    updateDPS() {
        const dps = this.calculateDPS();
        document.getElementById('current-dps').textContent = `DPS: ${dps}`;
    }
 
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('dps-control').textContent = 'Stop DPS';
        document.getElementById('dps-control').style.backgroundColor = '#f44336';
 
        this.updateDPS(); // Initial calculation
        this.intervalId = setInterval(() => this.updateDPS(), 1000);
    }
 
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.intervalId);
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        document.getElementById('dps-control').textContent = 'Start DPS';
        document.getElementById('dps-control').style.backgroundColor = '#4CAF50';
    }
 
    cleanup() {
        this.stop();
        if (this.observer) {
            this.observer.disconnect();
        }
        const display = document.getElementById('dps-display');
        if (display) {
            display.remove();
        }
    }
 
    restart() {
        this.stop();
        this.start();
    }
 }
 
 document.addEventListener('DOMContentLoaded', () => {
    if (window.dpsSimulator) {
        window.dpsSimulator.cleanup();
    }
    window.dpsSimulator = new DPSSimulator();
 });