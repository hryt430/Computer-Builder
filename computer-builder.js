config = {
    parent: document.getElementById("target"),
    url: "https://api.recursionist.io/builder/computers?type="
}

class PC {
    constructor(){
        PC.cpuBrand = null;
        PC.cpuModel = null;
        PC.cpuBenchMark = null;
        PC.gpuBrand = null;
        PC.gpuModel = null;
        PC.gpuBenchMark = null;
        PC.ramNum = null;
        PC.ramBrand = null;
        PC.ramModel = null;
        PC.ramBenchMark = null;
        PC.storageType = null;
        PC.storageSize = null;
        PC.storageBrand = null;
        PC.storageModel = null;
        PC.storageBenchMark = null;
    }

    
    setBrand(parts, brand, pc) {
        switch(parts) {
            case "cpu":
                pc.cpuBrand = brand;
                break;
            case "gpu":
                pc.gpuBrand = brand;
                break;
            case "ram":
                pc.ramBrand = brand;
                break;
            case "storage":
                pc.storageBrand = brand;
                break;
        }
    }
    
    setModel(part, model, pc) {
        switch(part) {
            case "cpu":
                pc.cpuModel = model;
                break;
            case "gpu":
                pc.gpuModel = model;
                break;
            case "ram":
                pc.ramModel = model;
                break;
            case "ssd":
            case "hdd":
                pc.storageModel = model;
                break;
        }
    }

    setBenchMark(part, benchMark, pc) {
        switch(part) {
            case "cpu":
                pc.cpuBenchMark = benchMark;
                break;
            case "gpu":
                pc.gpuBenchMark = benchMark;
                break;
            case "ram":
                pc.ramBenchMark = benchMark;
                break;
            case "ssd":
            case "hdd":
                pc.storageBenchMark = benchMark;
                break;
        }
    }

    static getGamingBenchmark(pc) {
        let cpuScore = pc.cpuBenchMark * 0.25;
        let gpuScore = pc.gpuBenchMark * 0.6;
        let ramScore = pc.ramBenchMark * 0.125;
        let storageScore = this.storageType = "ssd" ? pc.storageBenchMark * 0.1 : pc.storageBenchMark * 0.025;
        return Math.floor(cpuScore + gpuScore + ramScore + storageScore);
    }

    static getWorkBenchmark(pc) {
        let cpuScore = pc.cpuBenchMark * 0.6;
        let gpuScore = pc.gpuBenchMark * 0.25;
        let ramScore = pc.ramBenchMark * 0.1;
        let storageScore = pc.storageBenchMark * 0.05;
        return Math.floor(cpuScore + gpuScore + ramScore + storageScore);
    }
}

// パーツのブランドをフェッチする
function getBrandData(parts, brandOption, modelOption, pc) {
    fetch(config.url + parts).then(response => response.json()).then(function (data) {
        let brands = {}; // ブランド名を一意にするためのオブジェクト
        let models = {};
        let benchMarks = {};
        getBrand(data, brands);
        getModel(data, models)
        getBenchMark(data, benchMarks)

        // ブランドオプションを追加
        addOptions(brands, brandOption);

        brandOption.addEventListener("change", function(){
            let brand = brandOption.value;
            pc.setBrand(parts, brand, pc);
            getModelData(parts, modelOption, models, benchMarks, pc);
        });
    })
}

function getModelData(parts, modelOption, models, benchMarks, pc) {
    fetch(config.url + parts).then(response => response.json()).then(function (data) {
        modelOption.innerHTML = `<option>-</option>`;
        // フィルター関数
        switch (parts) {
            case "ram" :
                let filterRamList = ramModelFilter(models, pc);
                addOptions(filterRamList, modelOption);
                break;
            case "ssd":
            case "hdd" :
                let filterStorageList = storageModelFilter(models, pc);
                addOptions(filterStorageList, modelOption);
                break;

            default:
                let filterList = modelFilter(parts, models, pc)
                addOptions(filterList, modelOption);
        }

        modelOption.addEventListener("change", function(){
            let model = modelOption.value;
            let benchMark = benchMarks[model];
            pc.setModel(parts, model, pc);
            pc.setBenchMark(parts, benchMark, pc);
        });
    })
}

function getBrand(data, brandList) {
    for (let i in data) {
        let currentData = data[i];
        if (brandList[currentData.Brand] === undefined) { // ブランド名が存在する場合のみ処理
            brandList[currentData.Brand] = currentData.Brand;
        }
    }
}

function getModel(data, modelList) {
    for (let i in data) {
        let currentData = data[i];
        if (modelList[currentData.Model] === undefined) { // ブランド名が存在する場合のみ処理
            modelList[currentData.Model] = currentData.Brand;
        }
    }
}

function getBenchMark(data, bmList) {
    for (let i in data) {
        let currentData = data[i];
        if (bmList[currentData.Model] === undefined) { // ブランド名が存在する場合のみ処理
            bmList[currentData.Model] = currentData.Benchmark;
        }
    }
}

function addOptions(data, options) {
    for (let i in data) {
        let option = document.createElement("option");
        option.value = data[i];
        option.innerText = data[i];
        options.append(option);
    }
}

function modelFilter(parts, models, pc) {
    let filterList = {};
    for(let key in models) {
        if (parts == "cpu") {
            if(models[key] == pc.cpuBrand) filterList[key] = key;
        } else {
            if(models[key] == pc.gpuBrand) filterList[key] = key;
        }
    }
    return filterList;
}

function ramModelFilter(models, pc) {
    let filterList = {};
    for(let key in models) {
        if(models[key] == pc.ramBrand && key.includes(pc.ramNum + "x")) filterList[key] = key;
    }
    return filterList; 
}

function storageModelFilter(models, pc) {
    let filterList = {};
    for(let key in models) {
        if(models[key] == pc.storageBrand && key.includes(pc.storageSize)) filterList[key] = key;
    }
    return filterList
}

function getRamBrand(ramBrand, ramModel, pc) {
    ramNum.addEventListener("change", function() {
        pc.ramNum = ramNum.value;
        getBrandData("ram", ramBrand, ramModel, pc)
    })
}

function getStorageData(storageBrand, storageModel, pc) { 
    storageType.addEventListener("change", function() {
        pc.storageType = storageType.value.toLowerCase();
        getStorageSizeData(pc.storageType, storageSize, storageBrand, storageModel, pc)
    })
}

function getStorageSizeData(type, storageSize, storageBrand, storageModel, pc) {
    fetch(config.url + type).then(response => response.json()).then(function (data) {
        storageSize.innerHTML = `<option>-</option>`;
        storageBrand.innerHTML = `<option>-</option>`;
        storageModel.innerHTML = `<option>-</option>`;
        let TBsize = {};
        let GBsize = {};
        let brands = {};
        let models = {};
        let benchMarks = {};
        getStorageSize(data, TBsize, GBsize);
        getBrand(data, brands)
        getModel(data, models);
        getBenchMark(data, benchMarks);
        addOptions(TBsize, storageSize);
        addOptions(GBsize, storageSize);
        
        storageSize.addEventListener("change", function(){
            pc.storageSize = storageSize.value;
            getStorageBrand(type, storageBrand, storageModel, brands, models, benchMarks, pc);
        });
    })
}

function getStorageBrand(type, storageBrand, storageModel, brands, models, benchMarks, pc) {
    fetch(config.url + type).then(response => response.json()).then(function (data) {
        storageBrand.innerHTML = `<option>-</option>`;
        addOptions(brands, storageBrand);
        
        storageBrand.addEventListener("change", function() {
            pc.storageBrand = storageBrand.value;
            getModelData(type, storageModel, models, benchMarks, pc)
        })
    })
}

function getStorageSize(data, TBsize, GBsize) {
    let tempTB = {};
    let tempGB = {};
    for(let i in data) {
        let currentData = data[i].Model;
        let currentSize = currentData.split(" ").at(-1);
        if (currentSize.includes("GB")) {
            if (tempGB[currentSize] === undefined) tempGB[currentSize] = currentSize;
        }
        else if (currentSize.includes("TB")){
            if(tempTB[currentSize] === undefined ) tempTB[currentSize] = currentSize;
        }
    }
    let GBSizeList = Object.keys(tempGB);
    let TBSizeList = Object.keys(tempTB);

    GBSizeList = GBSizeList.map(items => parseFloat(items.slice(0,-2))).sort((a, b) => b - a).map(x => x.toString() + "TB")
    TBSizeList = TBSizeList.map(items => parseFloat(items.slice(0,-2))).sort((a, b) => b - a).map(x => x.toString() + "TB")

    for (let ele of GBSizeList) GBsize[ele] = ele;
    for (let ele of TBSizeList) TBsize[ele] = ele;
}

function createPC(pc) {
    let count = 0;
    let modelList = [pc.cpuModel, pc.gpuModel, pc.ramModel, pc.storageModel];
    let gamingScore = PC.getGamingBenchmark(pc);
    let workScore = PC.getWorkBenchmark(pc);
    for (let i = 0; i < modelList.length; i++) {
        if (modelList[i] == null) {
            return alert("Please fill in all forms.");
        }
    }
    count++;

    let div = document.createElement("div");
    div.classList.add("bg-primary", "text-white", "m-2", "col-12");
    div.innerHTML = `
    <div class="m-2 pt-3 d-flex justify-content-center">
        <h1>Your PC ${count}</h1>
    </div>
    <div class="m-2 pt-3 d-flex flex-column">
        <h1>CPU</h1>
        <h5>Brand: ${pc.cpuBrand}</h5>
        <h5>Model: ${pc.cpuModel}</h5>
    </div>
    <div class="m-2 pt-3 d-flex flex-column">
        <h1>GPU</h1>
        <h5>Brand: ${pc.gpuBrand}</h5>
        <h5>Model: ${pc.gpuModel}</h5>
    </div>
    <div class="m-2 pt-3 d-flex flex-column">
        <h1>RAM</h1>
        <h5>Brand: ${pc.ramBrand}</h5>
        <h5>Model: ${pc.ramModel}</h5>
    </div>
    <div class="m-2 pt-3 d-flex flex-column">
        <h1>Storage</h1>
        <h5>Disk: ${pc.storageType}</h5>
        <h5>Storage: ${pc.storageSize}</h5>
        <h5>Brand: ${pc.storageBrand}</h5>
        <h5>Model: ${pc.storageModel}</h5>
    </div>
    <div class="m-2 pt-3 d-flex justify-content-around align-items-center">
        <h1>Gaming: ${gamingScore}%</h1>
        <h1>Work: ${workScore}%</h1>
    </div>
    `;
    const displayPC = document.getElementById("displayPC");
    displayPC.append(div);
    return displayPC;
}
 

// ここら辺の重複もなんとかしたい
let pc = new PC();
let cpuBrand = document.getElementById("cpu-brand");
let cpuModel = document.getElementById("cpu-model");
let gpuBrand = document.getElementById("gpu-brand");
let gpuModel = document.getElementById("gpu-model");
let ramNum = document.getElementById("ram-num")
let ramBrand = document.getElementById("ram-brand")
let ramModel = document.getElementById("ram-model")
let storageType = document.getElementById("storage-type")
let storageSize = document.getElementById("storage-size")
let storageBrand = document.getElementById("storage-brand")
let storageModel = document.getElementById("storage-model")
let addPC = document.getElementById("addPC")
let displayPC = document.getElementById("displayPC")

getBrandData("cpu", cpuBrand, cpuModel ,pc);
getBrandData("gpu", gpuBrand, gpuModel ,pc);
getStorageData(storageBrand, storageModel, pc);
getRamBrand(ramBrand, ramModel, pc);

addPC.addEventListener("click", () => createPC(pc));
