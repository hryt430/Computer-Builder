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
            case "storage":
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
            case "storage":
                pc.storageBenchMark = benchMark;
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

            case "storage" : 
                let filterStorageList = storageModelFilter(models, pc);
                addOptions(filterStorageList, modelOption);
                break;

            default:
                let filterList = modelFilter(parts, models, pc)
                addOptions(filterList, modelOption);
        }

        modelOption.addEventListener("change", function(){
            let model = modelOption.value;
            let benchMark = aa;
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
        if (bmList[currentData.benchMark] === undefined) { // ブランド名が存在する場合のみ処理
            bmList[currentData.benchMark] = currentData.benchMark;
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
        if(models[key] == pc.storageBrand && models) aaa
    }
}


function getRamBrand(ramBrand, ramModel, pc) {
    ramNum.addEventListener("change", function() {
        pc.ramNum = ramNum.value;
        getBrandData("ram", ramBrand, ramModel, pc)
    })
}

function getStorageData(storageBrand, storageModel, pc) { 
    storageType.addEventListener("change", function() {
        pc.storageType = storageType.value;
        getStorageSizeData(pc.storageType.toLowerCase(), storageSize, storageBrand, storageModel, pc)
    })
}

function getStorageSizeData(type, storageSize, storageBrand, storageModel, pc) {
    fetch(config.url + type).then(response => response.json()).then(function (data) {
        storageSize.innerHTML = `<option>-</option>`;
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
    for(let i in data) {
        let currentData = data[i].Model;
        let currentSize = currentData.split(" ").at(-1);
        if (currentSize.includes("GB")) {
            if (GBsize[currentSize] === undefined) {
                GBsize[currentSize] = currentSize;
             }
        }
        else if (currentSize.includes("TB")){
            if(TBsize[currentSize] === undefined ) TBsize[currentSize] = currentSize;
        }
    }
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

getBrandData("cpu", cpuBrand, cpuModel ,pc);
getBrandData("gpu", gpuBrand, gpuModel ,pc);
getStorageData(storageBrand, storageModel, pc);

getRamBrand(ramBrand, ramModel, pc)

//     static getBrandData(parts, brandOp, modelOp, pc){ //->String, NodeList, NodeList, Object
//         fetch(config.url + parts).then(response=>response.json()).then(function(data){
//             brandOp.innerHTML = `<option>-</option>`;
//             let brandData = Controller.getBrand(data);
//             let modelData = Controller.getModel(data);
//             let benchmarkData = Controller.getBenchmark(data);
//             for(let brand in brandData){
//                 let option = document.createElement("option");
//                 option.value = brandData[brand];
//                 option.innerText = brandData[brand];
//                 brandOp.append(option);
//             }
//             brandOp.addEventListener("change", function(){
//                 Controller.getModelData(parts, brandOp, modelOp, modelData, benchmarkData, pc);
//             });
//         })
//     }

//     static getModelData(parts, brandOp, modelOp, modelData, benchmarkData, pc){ //->String, NodeList, NodeList,Array, Array, Object
//         fetch(config.url + parts).then(response=>response.json()).then(function(data){
//             modelOp.innerHTML = `<option>-</option>`;
//             let selectedBrand = brandOp.value;
//             PC.addBrandData(parts, selectedBrand, pc);

//             if(parts == "hdd" || parts == "ssd"){
//                 const storageSizeOp = document.querySelectorAll(config.storage.size)[0];
//                 let selectedSize = storageSizeOp.value;
//                 let filteredStorageModel = Controller.filterStorageModel(selectedSize, modelData[selectedBrand]);
//                 Controller.addOptionList(filteredStorageModel, modelOp);
//             }else if(parts == "ram"){
//                 const ramNumOp = document.querySelectorAll(config.ram.num)[0];
//                 let selectedNumber = ramNumOp.value;
//                 let filteredRamModel = Controller.filterRamModel(selectedNumber, modelData[selectedBrand]);
//                 Controller.addOptionList(filteredRamModel, modelOp);
//             } else{
//                 Controller.addOptionList(modelData[selectedBrand], modelOp)
//             }
            
//             modelOp.addEventListener("change", function(){
//                 let selectedModel = modelOp.value;
//                 let selectedBenchmark = benchmarkData[selectedModel];
//                 PC.addModelData(parts, selectedModel, pc);
//                 PC.addBenchmarkData(parts, selectedBenchmark, pc);
//             });

//         })
//     }

//     static getStorageData(storageBrandOp, storageModelOp, pc){ //->NodeList, NodeList, Object
//         const storageTypeOp = document.querySelectorAll(config.storage.type)[0];
//         const storageSizeOp = document.querySelectorAll(config.storage.size)[0];
//         storageTypeOp.addEventListener("change", function(){
//             storageSizeOp.innerHTML = `<option>-</option>`;
//             let selectedStorageType = storageTypeOp.value;
//             pc.storageType = selectedStorageType;
//             if(selectedStorageType == "HDD"){
//                 Controller.getStorageSizeData("hdd");
//                 storageSizeOp.addEventListener("change", function(){
//                     storageBrandOp.innerHTML = `<option>-</option>`;
//                     let selectedSize = storageSizeOp.value;
//                     PC.addStorageSizeData(selectedSize, pc);
//                     Controller.getBrandData("hdd", storageBrandOp, storageModelOp, pc);            
//                 })
//             } else{
//                 Controller.getStorageSizeData("ssd");
//                 storageSizeOp.addEventListener("change", function(){
//                     storageModelOp.innerHTML = `<option>-</option>`;
//                     let selectedSize = storageSizeOp.value;
//                     PC.addStorageSizeData(selectedSize, pc);
//                     Controller.getBrandData("ssd", storageBrandOp, storageModelOp, pc);
//                 })
//             }
//         });
//     }

//     static getStorageSizeData(type){ //->String
//         fetch(config.url + type).then(response=>response.json()).then(function(data){
//             const storageSizeOp = document.querySelectorAll(config.storage.size)[0];
//             let storagemodelData = Controller.getStorageModel(data);
//             let storageSizeList = Controller.getStorageSizeList(storagemodelData);
//             Controller.addOptionList(storageSizeList, storageSizeOp);
//         });
//     }

//     static getStorageSizeList(storageModelData){ //->Object
//         let storageModelList = Object.keys(storageModelData); 
//         let tbSizeList = [];
//         let gbSizeList = [];

//         storageModelList.forEach(model =>{
//             if(model.includes("TB")) tbSizeList.push(parseFloat(model.replace("TB",'')));
//             else gbSizeList.push(parseFloat(model.replace("GB",'')));
//         })

//         let sortedTb = tbSizeList.sort((a, b) => b - a).map(x => x.toString() + "TB");
//         let sortedGb = gbSizeList.sort((a, b) => b - a).map(x => x.toString() + "GB");
//         return sortedTb.concat(sortedGb);
//     }


//     static getStorageModel(data){ //->Array
//         let modelData = {};
//         for(let i in data){
//             let currentData = Controller.getStorageSizeString(data[i].Model);
//             if(modelData[currentData] == undefined) modelData[currentData] = currentData;
//         }
//         return modelData;
//     }

//     static getStorageSizeString(storageModel){ //->String
//         let storageSize = storageModel.split(' ').filter(word => word.includes("GB") || word.includes("TB")).join('');
//         return storageSize;
//     }

//     static filterStorageModel(size, storageModelData){ //->String, Array
//         let storageModelList = Object.values(storageModelData);
//         return storageModelList.filter(word => word.includes(' ' + size));
//     }

//     static clickAddPc(pc){ //->Object
//         let modelList = [pc.cpuModel, pc.gpuModel, pc.ramModel, pc.storageModel];
//         let gamingScore = PC.getGamingBenchmark(pc);
//         let workScore = PC.getWorkBenchmark(pc);
//         for(let i = 0; i < modelList.length; i++){
//             if(modelList[i] == null) return alert("Please fill in all forms.")
//         }
//         Controller.count++;
//         return View.createbuiltPcPage(pc, gamingScore, workScore, Controller.count);
//     }
// }