const { fromDataToEntity } = require('../mapper/discountMapper');
const DiscountIdNotDefinedError = require('../error/DiscountIdNotDefinedError');

module.exports = class DiscountController {
  /**
   * @param  {import("../service/discountService")} discountService
   */
  constructor(discountService) {
    this.ADMIN_ROUTE = '/admin';
    this.discountService = discountService;
    this.DISCOUNT_VIEWS = 'discount/view';
    this.ROUTE_BASE = '/admin/discount';
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.auth.bind(this), this.index.bind(this));
    app.get(`${ROUTE}/view/:id`, this.auth.bind(this), this.view.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.auth.bind(this), this.edit.bind(this));
    app.get(`${ROUTE}/create`, this.auth.bind(this), this.create.bind(this));
    app.post(`${ROUTE}/save`, this.auth.bind(this), this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.auth.bind(this), this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async auth(req, res, next) {
    if (req.session.username === process.env.ADMIN_USERNAME && req.session.admin) {
      return next();
    }
    req.session.errors = ['You can only see this after you have logged in'];
    res.redirect(`${this.ADMIN_ROUTE}`);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const discountsList = await this.discountService.getAll();
    const { errors, messages } = req.session;
    res.render(`${this.DISCOUNT_VIEWS}/index.njk`, {
      discountsList,
      messages,
      errors,
    });
    req.session.errors = [];
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async view(req, res) {
    try {
      const { id } = req.params;
      if (!Number(id)) {
        throw new DiscountIdNotDefinedError();
      }

      const discount = await this.discountService.getById(id);
      res.render(`${this.DISCOUNT_VIEWS}/view.njk`, {
        discount,
      });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new DiscountIdNotDefinedError();
    }

    try {
      const discount = await this.discountService.getById(id);
      res.render(`${this.DISCOUNT_VIEWS}/form.njk`, {
        discount,
      });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  create(req, res) {
    res.render(`${this.DISCOUNT_VIEWS}/form.njk`);
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async save(req, res) {
    try {
      const discountData = fromDataToEntity(req.body);
      const savedDiscount = await this.discountService.save(discountData);
      if (discountData.id) {
        req.session.messages = [
          `The discount type: ${savedDiscount.type} with value: ${savedDiscount.value} was updated correctly (ID: ${savedDiscount.id})`,
        ];
      } else {
        req.session.messages = [
          `The discount type: ${savedDiscount.type} with value: ${savedDiscount.value} was created correctly (ID: ${savedDiscount.id})`,
        ];
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new DiscountIdNotDefinedError();
    }
    try {
      const discount = await this.discountService.getById(id);
      await this.discountService.delete(discount);
      req.session.messages = [
        `The discount type: ${discount.type} with value: ${discount.value} was removed (ID: ${id})`,
      ];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }
};
