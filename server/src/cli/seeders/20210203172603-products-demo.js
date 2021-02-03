module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('discounts', [
      {
        type: 'Fixed',
        value: 4000,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        type: 'Fixed',
        value: 1000,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        type: 'Percentage',
        value: 2,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        type: 'Percentage',
        value: 3,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Electronics',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('brands', [
      {
        name: 'AMD',
        logo:
          'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEX///8AAADCwsIKCgrr6+svLy9zc3OUlJQEBAQbGxsLCwseHh66urr4+PhOTk7c3NyioqJlZWW0tLTk5OSurq5YWFh+fn7IyMgRERHy8vIjIyPY2Ng5OTkXFxdZWVkrKyuJiYlERERvb29CQkKlpaWPj4/Q0NBhYWGZiFAwAAADeklEQVR4nO2X2ZaiMBBAg2gbwYB2VBZxQ8X//8OBVFaW6PQ5PS9T9wljlptQVBJCEARBEARBEARBEARBEARBEARBfhs2Ww/4NvwDgWseerBq8hkwd9s3XVnGet1C5dRuJ8gaXvQNDmEwjVXvLJ22zmDzqivLr64Bv4mqh+55GZn5RPmprLZr18FrYKodY1m0ahyBhSiMNnZhsYeqX0Jg0GlUbRwFn4GpddBlhxGB4GSFC6upVyAIwuT4oYG11LqsTEcEgjLTZVfV3aRAECwyqxOPga7yHekyai+3FggqNalNroosAbqv63p7rmI10uKzNdAV4K3C0lbzMYEg4aJkvdIllkA0E90U6e4u30/Si4N4ZaHnoP4/il7pWfwR7kYFglfXZXMxBQMB0UJONnzYAoSlNk/aE4AQXGX3vrwtQA+McBMrEwKEfQ0Xsv1ynA950xOQw5zZUvyRm95sgSBczhP7BY4LEL4YFBFe26E9ENiJVQu/CS9FsUlGKg9Ag7yi9s8JAXKFzq/W+MnKJ8BgXpc2yrbi6aSTkRS4vVQL4XGNvQINxFiip8GTwCsAISgyUJbrR1sg4dbah8/ULyDXcaGCoGvsFYAQzLvcUdzEs05GSoClOvroF+N+Adnows34XgFZ/y5ifyPCgS77Aub728/JZwIlN+N7BSAEZQLkMI76hoyAykD3tts3As4rkC/PIyBDcCVz5xe8591AAHLwoovPNwIykO7MjO8TaGBm+V5wlqn0VgwEWLsLxWKgNwIwB4hk+ewTUFVcZI+2ACnqEhbGL5DCWwzX3Y/tWwEn11m82ECAFJy9Fyhe0AF8BO8FHhMbJSQjV0DhE5jX0CF9ElsgX+40mdn9dQjSuIwlpdxvD38twNrteCOzdVBxRyCgmnJtzgdtCJ7Ewy3lmgy+IpGMPhWg9y6CkypWa6tOUFpAE3enO2WgQpA6mzc0EsnoU4E+5ZpMCMRwupQGaut0zoHqO+4Syc8EwkTvZn2BWJ1uwYAsYSVqZwC5IXTJ6CcC0f1hziI9gdicroUBEfeO8DRz+icPuE61J6P2YhJFUbjvCVxGLyZRlK8ut2dmnwa3U+ODAclmY1evQhezJus4uv+zbPxqljVH3utqOzm+MCC/Tk3NzS3uX4bZ8/cFjta1vBn827/0IgiCIAiCIAiCIAiCIAiCIAjyH/IHEo06fD3JJuQAAAAASUVORK5CYII=',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('products', [
      {
        name: 'Ryzen 9',
        default_price: 50000,
        image_src:
          'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEX///8AAADCwsIKCgrr6+svLy9zc3OUlJQEBAQbGxsLCwseHh66urr4+PhOTk7c3NyioqJlZWW0tLTk5OSurq5YWFh+fn7IyMgRERHy8vIjIyPY2Ng5OTkXFxdZWVkrKyuJiYlERERvb29CQkKlpaWPj4/Q0NBhYWGZiFAwAAADeklEQVR4nO2X2ZaiMBBAg2gbwYB2VBZxQ8X//8OBVFaW6PQ5PS9T9wljlptQVBJCEARBEARBEARBEARBEARBEARBfhs2Ww/4NvwDgWseerBq8hkwd9s3XVnGet1C5dRuJ8gaXvQNDmEwjVXvLJ22zmDzqivLr64Bv4mqh+55GZn5RPmprLZr18FrYKodY1m0ahyBhSiMNnZhsYeqX0Jg0GlUbRwFn4GpddBlhxGB4GSFC6upVyAIwuT4oYG11LqsTEcEgjLTZVfV3aRAECwyqxOPga7yHekyai+3FggqNalNroosAbqv63p7rmI10uKzNdAV4K3C0lbzMYEg4aJkvdIllkA0E90U6e4u30/Si4N4ZaHnoP4/il7pWfwR7kYFglfXZXMxBQMB0UJONnzYAoSlNk/aE4AQXGX3vrwtQA+McBMrEwKEfQ0Xsv1ynA950xOQw5zZUvyRm95sgSBczhP7BY4LEL4YFBFe26E9ENiJVQu/CS9FsUlGKg9Ag7yi9s8JAXKFzq/W+MnKJ8BgXpc2yrbi6aSTkRS4vVQL4XGNvQINxFiip8GTwCsAISgyUJbrR1sg4dbah8/ULyDXcaGCoGvsFYAQzLvcUdzEs05GSoClOvroF+N+Adnows34XgFZ/y5ifyPCgS77Aub728/JZwIlN+N7BSAEZQLkMI76hoyAykD3tts3As4rkC/PIyBDcCVz5xe8591AAHLwoovPNwIykO7MjO8TaGBm+V5wlqn0VgwEWLsLxWKgNwIwB4hk+ewTUFVcZI+2ACnqEhbGL5DCWwzX3Y/tWwEn11m82ECAFJy9Fyhe0AF8BO8FHhMbJSQjV0DhE5jX0CF9ElsgX+40mdn9dQjSuIwlpdxvD38twNrteCOzdVBxRyCgmnJtzgdtCJ7Ewy3lmgy+IpGMPhWg9y6CkypWa6tOUFpAE3enO2WgQpA6mzc0EsnoU4E+5ZpMCMRwupQGaut0zoHqO+4Syc8EwkTvZn2BWJ1uwYAsYSVqZwC5IXTJ6CcC0f1hziI9gdicroUBEfeO8DRz+icPuE61J6P2YhJFUbjvCVxGLyZRlK8ut2dmnwa3U+ODAclmY1evQhezJus4uv+zbPxqljVH3utqOzm+MCC/Tk3NzS3uX4bZ8/cFjta1vBn827/0IgiCIAiCIAiCIAiCIAiCIAjyH/IHEo06fD3JJuQAAAAASUVORK5CYII=',
        description: 'CPU',
        brand_fk: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        name: 'Ryzen 7',
        default_price: 25000,
        image_src:
          'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEX///8AAADCwsIKCgrr6+svLy9zc3OUlJQEBAQbGxsLCwseHh66urr4+PhOTk7c3NyioqJlZWW0tLTk5OSurq5YWFh+fn7IyMgRERHy8vIjIyPY2Ng5OTkXFxdZWVkrKyuJiYlERERvb29CQkKlpaWPj4/Q0NBhYWGZiFAwAAADeklEQVR4nO2X2ZaiMBBAg2gbwYB2VBZxQ8X//8OBVFaW6PQ5PS9T9wljlptQVBJCEARBEARBEARBEARBEARBEARBfhs2Ww/4NvwDgWseerBq8hkwd9s3XVnGet1C5dRuJ8gaXvQNDmEwjVXvLJ22zmDzqivLr64Bv4mqh+55GZn5RPmprLZr18FrYKodY1m0ahyBhSiMNnZhsYeqX0Jg0GlUbRwFn4GpddBlhxGB4GSFC6upVyAIwuT4oYG11LqsTEcEgjLTZVfV3aRAECwyqxOPga7yHekyai+3FggqNalNroosAbqv63p7rmI10uKzNdAV4K3C0lbzMYEg4aJkvdIllkA0E90U6e4u30/Si4N4ZaHnoP4/il7pWfwR7kYFglfXZXMxBQMB0UJONnzYAoSlNk/aE4AQXGX3vrwtQA+McBMrEwKEfQ0Xsv1ynA950xOQw5zZUvyRm95sgSBczhP7BY4LEL4YFBFe26E9ENiJVQu/CS9FsUlGKg9Ag7yi9s8JAXKFzq/W+MnKJ8BgXpc2yrbi6aSTkRS4vVQL4XGNvQINxFiip8GTwCsAISgyUJbrR1sg4dbah8/ULyDXcaGCoGvsFYAQzLvcUdzEs05GSoClOvroF+N+Adnows34XgFZ/y5ifyPCgS77Aub728/JZwIlN+N7BSAEZQLkMI76hoyAykD3tts3As4rkC/PIyBDcCVz5xe8591AAHLwoovPNwIykO7MjO8TaGBm+V5wlqn0VgwEWLsLxWKgNwIwB4hk+ewTUFVcZI+2ACnqEhbGL5DCWwzX3Y/tWwEn11m82ECAFJy9Fyhe0AF8BO8FHhMbJSQjV0DhE5jX0CF9ElsgX+40mdn9dQjSuIwlpdxvD38twNrteCOzdVBxRyCgmnJtzgdtCJ7Ewy3lmgy+IpGMPhWg9y6CkypWa6tOUFpAE3enO2WgQpA6mzc0EsnoU4E+5ZpMCMRwupQGaut0zoHqO+4Syc8EwkTvZn2BWJ1uwYAsYSVqZwC5IXTJ6CcC0f1hziI9gdicroUBEfeO8DRz+icPuE61J6P2YhJFUbjvCVxGLyZRlK8ut2dmnwa3U+ODAclmY1evQhezJus4uv+zbPxqljVH3utqOzm+MCC/Tk3NzS3uX4bZ8/cFjta1vBn827/0IgiCIAiCIAiCIAiCIAiCIAjyH/IHEo06fD3JJuQAAAAASUVORK5CYII=',
        description: 'CPU',
        brand_fk: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        name: 'Ryzen 5',
        default_price: 18000,
        image_src:
          'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEX///8AAADCwsIKCgrr6+svLy9zc3OUlJQEBAQbGxsLCwseHh66urr4+PhOTk7c3NyioqJlZWW0tLTk5OSurq5YWFh+fn7IyMgRERHy8vIjIyPY2Ng5OTkXFxdZWVkrKyuJiYlERERvb29CQkKlpaWPj4/Q0NBhYWGZiFAwAAADeklEQVR4nO2X2ZaiMBBAg2gbwYB2VBZxQ8X//8OBVFaW6PQ5PS9T9wljlptQVBJCEARBEARBEARBEARBEARBEARBfhs2Ww/4NvwDgWseerBq8hkwd9s3XVnGet1C5dRuJ8gaXvQNDmEwjVXvLJ22zmDzqivLr64Bv4mqh+55GZn5RPmprLZr18FrYKodY1m0ahyBhSiMNnZhsYeqX0Jg0GlUbRwFn4GpddBlhxGB4GSFC6upVyAIwuT4oYG11LqsTEcEgjLTZVfV3aRAECwyqxOPga7yHekyai+3FggqNalNroosAbqv63p7rmI10uKzNdAV4K3C0lbzMYEg4aJkvdIllkA0E90U6e4u30/Si4N4ZaHnoP4/il7pWfwR7kYFglfXZXMxBQMB0UJONnzYAoSlNk/aE4AQXGX3vrwtQA+McBMrEwKEfQ0Xsv1ynA950xOQw5zZUvyRm95sgSBczhP7BY4LEL4YFBFe26E9ENiJVQu/CS9FsUlGKg9Ag7yi9s8JAXKFzq/W+MnKJ8BgXpc2yrbi6aSTkRS4vVQL4XGNvQINxFiip8GTwCsAISgyUJbrR1sg4dbah8/ULyDXcaGCoGvsFYAQzLvcUdzEs05GSoClOvroF+N+Adnows34XgFZ/y5ifyPCgS77Aub728/JZwIlN+N7BSAEZQLkMI76hoyAykD3tts3As4rkC/PIyBDcCVz5xe8591AAHLwoovPNwIykO7MjO8TaGBm+V5wlqn0VgwEWLsLxWKgNwIwB4hk+ewTUFVcZI+2ACnqEhbGL5DCWwzX3Y/tWwEn11m82ECAFJy9Fyhe0AF8BO8FHhMbJSQjV0DhE5jX0CF9ElsgX+40mdn9dQjSuIwlpdxvD38twNrteCOzdVBxRyCgmnJtzgdtCJ7Ewy3lmgy+IpGMPhWg9y6CkypWa6tOUFpAE3enO2WgQpA6mzc0EsnoU4E+5ZpMCMRwupQGaut0zoHqO+4Syc8EwkTvZn2BWJ1uwYAsYSVqZwC5IXTJ6CcC0f1hziI9gdicroUBEfeO8DRz+icPuE61J6P2YhJFUbjvCVxGLyZRlK8ut2dmnwa3U+ODAclmY1evQhezJus4uv+zbPxqljVH3utqOzm+MCC/Tk3NzS3uX4bZ8/cFjta1vBn827/0IgiCIAiCIAiCIAiCIAiCIAjyH/IHEo06fD3JJuQAAAAASUVORK5CYII=',
        description: 'CPU',
        brand_fk: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        name: 'Ryzen 3',
        default_price: 12000,
        image_src:
          'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEX///8AAADCwsIKCgrr6+svLy9zc3OUlJQEBAQbGxsLCwseHh66urr4+PhOTk7c3NyioqJlZWW0tLTk5OSurq5YWFh+fn7IyMgRERHy8vIjIyPY2Ng5OTkXFxdZWVkrKyuJiYlERERvb29CQkKlpaWPj4/Q0NBhYWGZiFAwAAADeklEQVR4nO2X2ZaiMBBAg2gbwYB2VBZxQ8X//8OBVFaW6PQ5PS9T9wljlptQVBJCEARBEARBEARBEARBEARBEARBfhs2Ww/4NvwDgWseerBq8hkwd9s3XVnGet1C5dRuJ8gaXvQNDmEwjVXvLJ22zmDzqivLr64Bv4mqh+55GZn5RPmprLZr18FrYKodY1m0ahyBhSiMNnZhsYeqX0Jg0GlUbRwFn4GpddBlhxGB4GSFC6upVyAIwuT4oYG11LqsTEcEgjLTZVfV3aRAECwyqxOPga7yHekyai+3FggqNalNroosAbqv63p7rmI10uKzNdAV4K3C0lbzMYEg4aJkvdIllkA0E90U6e4u30/Si4N4ZaHnoP4/il7pWfwR7kYFglfXZXMxBQMB0UJONnzYAoSlNk/aE4AQXGX3vrwtQA+McBMrEwKEfQ0Xsv1ynA950xOQw5zZUvyRm95sgSBczhP7BY4LEL4YFBFe26E9ENiJVQu/CS9FsUlGKg9Ag7yi9s8JAXKFzq/W+MnKJ8BgXpc2yrbi6aSTkRS4vVQL4XGNvQINxFiip8GTwCsAISgyUJbrR1sg4dbah8/ULyDXcaGCoGvsFYAQzLvcUdzEs05GSoClOvroF+N+Adnows34XgFZ/y5ifyPCgS77Aub728/JZwIlN+N7BSAEZQLkMI76hoyAykD3tts3As4rkC/PIyBDcCVz5xe8591AAHLwoovPNwIykO7MjO8TaGBm+V5wlqn0VgwEWLsLxWKgNwIwB4hk+ewTUFVcZI+2ACnqEhbGL5DCWwzX3Y/tWwEn11m82ECAFJy9Fyhe0AF8BO8FHhMbJSQjV0DhE5jX0CF9ElsgX+40mdn9dQjSuIwlpdxvD38twNrteCOzdVBxRyCgmnJtzgdtCJ7Ewy3lmgy+IpGMPhWg9y6CkypWa6tOUFpAE3enO2WgQpA6mzc0EsnoU4E+5ZpMCMRwupQGaut0zoHqO+4Syc8EwkTvZn2BWJ1uwYAsYSVqZwC5IXTJ6CcC0f1hziI9gdicroUBEfeO8DRz+icPuE61J6P2YhJFUbjvCVxGLyZRlK8ut2dmnwa3U+ODAclmY1evQhezJus4uv+zbPxqljVH3utqOzm+MCC/Tk3NzS3uX4bZ8/cFjta1vBn827/0IgiCIAiCIAiCIAiCIAiCIAjyH/IHEo06fD3JJuQAAAAASUVORK5CYII=',
        description: 'CPU',
        brand_fk: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('category_products', [
      {
        product_id: 1,
        category_id: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('discount_brand', [
      {
        discount_id: 3,
        brand_id: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('discount_category', [
      {
        discount_id: 4,
        category_id: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
    await queryInterface.bulkInsert('discount_products', [
      {
        discount_id: 1,
        product_id: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        discount_id: 2,
        product_id: 1,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        discount_id: 2,
        product_id: 2,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        discount_id: 4,
        product_id: 3,
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('brands', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('categories', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('discounts', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
