config = {
    parent: document.getElementById("target"),
    url: "https://api.recursionist.io/builder/computers?type="
}

class PC {
    constructor(){
        PC.cpuBrand = null;
        PC.cpuModel = null;
        PC.cpuBenchmark = null;
        PC.gpuBrand = null;
        PC.gpuModel = null;
        PC.gpuBenchmark = null;
        PC.memoryNum = null;
        PC.memoryBrand = null;
        PC.memoryModel = null;
        PC.memoryBenchmark = null;
        PC.storageType = null;
        PC.storageSize = null;
        PC.storageBrand = null;
        PC.storageModel = null;
        PC.storageBenchmark = null;
    }

    
    setBrand(part, brand, pc) {
        switch(part) {
            case "cpu":
                pc.cpuBrand = brand;
                break;
            case "gpu":
                pc.gpuBrand = brand;
                break;
            case "memory":
                pc.memoryBrand = brand;
                break;
            case "storage":
                pc.storageBrand = brand;
                break;
        }
    }
    
    setBrand(part, model, pc) {
        switch(part) {
            case "cpu":
                pc.cpuModel = model;
                break;
            case "gpu":
                pc.gpuModel = model;
                break;
            case "memory":
                pc.memoryModel = model;
                break;
            case "storage":
                pc.storageModel = model;
                break;
        }
    }

    static getGamingBenchmark(pc) {
        let cpuScore = parseInt(pc.cpuBenchmark * 0.25);
        let gpuScore = parseInt(pc.gpuBenchmark * 0.6);
        let ramScore = parseInt(pc.memoryBenchmark * 0.125);
        let storageScore = this.storageType = "SSD" ? parseInt(pc.storageBenchmark * 0.1) : parseInt(pc.storageBenchmark * 0.025);
        return cpuScore + gpuScore + ramScore + storageScore;
    }

    static getWorkBenchmark(pc) {
        let cpuScore = parseInt(pc.cpuBenchmark * 0.6);
        let gpuScore = parseInt(pc.gpuBenchmark * 0.25);
        let ramScore = parseInt(pc.ramBenchmark * 0.1);
        let storageScore = parseInt(pc.storageBenchmark * 0.05);
        return cpuScore + gpuScore + ramScore + storageScore;
    }
}
// パーツのブランドをフェッチする
function getBrandData(parts, brandOption, modelOption, pc) {
    fetch(config.url + parts).then(response => response.json()).then(function (data) {
        let brands = {}; // ブランド名を一意にするためのオブジェクト

        // データからブランド名を収集
        for (let brand in data) {
            let currentBrand = data[brand];
            if (currentBrand.Brand) { // ブランド名が存在する場合のみ処理
                brands[currentBrand.Brand] = currentBrand.Brand;
            }
        }

        // ブランドオプションを追加
        for (let brand in brands) {
            let option = document.createElement("option");
            option.value = brands[brand];
            option.innerText = brands[brand];
            brandOption.append(option);
        }
        brandOption.addEventListener("change", function(){
            getModelData(parts, brandOption, modelOption, pc);
            pc.cpuBrand = brandOption.value;
        });
    })
}

function getModelData(parts, brandOption, modelOption, pc) {
    fetch(config.url + parts).then(response => response.json()).then(function (data) {
        modelOption.innerHTML = `<option>-</option>`;
        let models = {}; // ブランド名を一意にするためのオブジェクト

        // データからブランド名を収集
        for (let model in data) {
            let currentModel = data[model];
            if (currentModel.Model && currentModel.Brand == pc.cpuBrand) { // ブランド名が存在する場合のみ処理
                models[currentModel.Model] = currentModel.Model;
            }
        }

        // ブランドオプションを追加
        for (let model in models) {
            let option = document.createElement("option");
            option.value = models[model];
            option.innerText = models[model];
            modelOption.append(option);
        }
        brandOption.addEventListener("change", function(){
            getModelData(parts, brandOption, modelOption, pc);
            pc.cpuModel = modelOption.value;
        });
    })
}

function getStorageBrand() {
    storage.addEventListener("change", function() {
        
    })
}

let pc = new PC;
let cpuOption = document.getElementById("cpu-brand");
let cpuModel = document.getElementById("cpu-model");
let storage = document.getElementById("memory-num")
getBrandData("cpu", cpuOption, cpuModel ,pc);
getModelData("cpu", cpuOption, cpuModel, pc)