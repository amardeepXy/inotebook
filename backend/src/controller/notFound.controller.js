import ApiErrorRes from "../utils/ApiErrorRes.js";

const notFoundController = function(req, res){
   return res.status(404).json(new ApiErrorRes(404, 'Route not found'));
}

export default notFoundController;