
const _ = require('lodash');
const responseUtil = require('../../util/response');
const fileUtil = require('../../util/fileUtils');

const request = require('request');

const config = require('../../config/config');

module.exports = {

    // store list
    async getList(req, res, next){

        let data = fileUtil.getFile();

        await responseUtil.makeResponse(config.ResponseCode.OK,data,res);

    },
    async getListByName(req, res, next){

        let data = fileUtil.getFile();
        let {
            name,
        } = _.get(req, 'params', '');

        if(name===undefined){
            await responseUtil.makeResponse(config.ResponseCode.invalidValue,'invalid value',res);
        } else {
            let result =_.filter(data,{name : name} ).map(value => value);
            if(result.length ===0 ){
                await responseUtil.makeResponse(config.ResponseCode.notFind,"can not find", res);
            }
            await responseUtil.makeResponse(config.ResponseCode.OK,result,res);
        }
    },
    async getLatitudeLongitudeByPostcode(req, res, next){


        let data = fileUtil.getFile();
        let {
            postcode,
        } = _.get(req, 'params', '');

        let checkResult =_.filter(data,{postcode : postcode} ).map(value => value.postcode);

        if(checkResult.length ===0 ){
            await responseUtil.makeResponse(config.ResponseCode.notFind,"can not find", res);
        } else {

            request(config.postCodeApiUrl+'/'+postcode, function (error, response, body) {

                if(body=== undefined){
                    const {err }  = _.get(body,'err',{});
                    responseUtil.makeResponse(config.ResponseCode.invalidValue,err ,res);
                } else {

                    const {
                        longitude,
                        latitude,
                        postcode
                    } = _.get(JSON.parse(body),'result');

                    if(longitude===undefined || latitude===undefined || postcode===undefined){
                        responseUtil.makeResponse(config.ResponseCode.invalidValue,'invalid value' ,res);
                    }

                    let result = {
                        latitude,
                        longitude,
                        postcode
                    }
                    responseUtil.makeResponse(config.ResponseCode.OK,result ,res);
                }
            });
        }

    },
    async getLatitudeLongitudeByPostcodes(req, res, next){

        let data = fileUtil.getFile();
        let {
            postcodes,
        } = _.get(req, 'body', '');

        _.forEach(postcodes , (value)=>{

            if(_.includes(_.map(data , 'postcode'), value)){
                responseUtil.makeResponse(config.ResponseCode.notFind,"someone wrong postcode" ,res);
            }

        })

        console.log("postCode " , req.body);


            let options = {
                uri: config.postCodeApiUrl+"/",
                method: 'POST',
                body:{
                    postcodes
                },
                json:true
            };
            request.post(options, function(err,httpResponse,body){

                console.log("@@@ body " , body);
            const result = _.map(body.result , v => {
                const subResult ={
                    longitude: _.get(v,'result.longitude',''),
                    latitude: _.get(v,'result.latitude',''),
                };
                return subResult;
            })
                 responseUtil.makeResponse(body.status, result,res);
            })



    }
,
    async getPostcodeList(req, res, next){


        let {
            longitude,
            latitude,
            radius,
        } = _.get(req, 'body', '');

        if(longitude===undefined || latitude===undefined || postcode===undefined){
            await responseUtil.makeResponse(config.ResponseCode.invalidValue,'invalid value' ,res);
        }
        let options = {
            uri: config.postCodeApiUrl,
            method: 'POST',
            body:{
                'geolocations' : [ {
                    longitude,
                    latitude,
                    radius,
                    'limit': 5
                }]
            },
            json:true
        };

        request.post(options, function(err,httpResponse,body){

            const result = _.get(body, 'result')
            responseUtil.makeResponse(body.status, result,res);
        })



    }
}