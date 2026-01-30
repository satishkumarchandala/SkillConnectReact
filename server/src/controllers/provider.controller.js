const { searchProvidersSchema } = require("../validators/provider.validators");
const providerService = require("../services/provider.service");

const searchProviders = async (req, res, next) => {
  try {
    const { value, error } = searchProvidersSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const skills = value.skills
      ? value.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

    const results = await providerService.searchProviders({
      ...value,
      skills,
    });

    return res.json({
      results,
      page: value.page,
      limit: value.limit,
    });
  } catch (err) {
    return next(err);
  }
};

const getProviderById = async (req, res, next) => {
  try {
    const provider = await providerService.getProviderById(req.params.id);
    return res.json({ provider });
  } catch (err) {
    return next(err);
  }
};

module.exports = { searchProviders, getProviderById };
