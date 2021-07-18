module.exports = {

  // store list
  async makeResponse(code , data , res){


    let result = {
      status:code,
      result : data

    }
    res.status(result.status).json(result);

  }
}