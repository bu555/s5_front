//本地存取config
const StorageConfig = {
    set(obj){
        let config;
        if(window.localStorage.getItem('config')){
            config = JSON.parse(window.localStorage.getItem('config'));
            for(let key in obj){
                config[key] = obj[key];
            }
        }else{
            config = obj;
        }
        window.localStorage.setItem('config',JSON.stringify(config));
    },
    get(key){
        if(window.localStorage.getItem('config')){
            console.log(window.localStorage.getItem('config'))
            let config = JSON.parse(window.localStorage.getItem('config'));
            if(key){
                return config[key];
            }else{
                return config;
            }
        }else{
            return null;
        }

    }
}
export default StorageConfig;

