'use strict';
//const should = require("should");
const fs = require("fs");
const Path = require("path").posix;
const should = require("should");

const collada = require("../index");

const dirname = __dirname.replace(/\\/g, "/");
const models_directory = Path.join(dirname, "models");
const test_dae = Path.join(models_directory, "Sponza.DAE");
const test_dependencies = [ '/images/2_00_SKAP.JPG',
  '/images/4_01_STUB-bump_nrm.tga',
  '/images/3_01_STUB.JPG',
  '/images/6_01_ST_KP.JPG',
  '/images/5_01_S_BA.JPG',
  '/images/7_01_St_kp-bump_nrm.tga',
  '/images/12_KAMEN-bump_nrm.tga',
  '/images/11_KAMEN.JPG',
  '/images/13_PROZOR1.JPG',
  '/images/9_RELJEF.JPG',
  '/images/0_SP_LUK.JPG',
  '/images/15_VRATA_KO.JPG',
  '/images/14_VRATA_KR.JPG',
  '/images/8_X01_ST.JPG',
  '/images/10_reljef-bump_nrm.tga',
  '/images/1_sp_luk-bump_nrm.tga' ].map(dep => Path.join(models_directory, dep));

describe("Collada utilities", function () {
    
    it("#Parse sponza example", function (done) {
        collada.parse(test_dae)
            .then(xmldom => {
                this.timeout(1000);
                const elements = xmldom.getElementsByTagName("comments");
                elements.length.should.equal(1);
                elements[0].childNodes[0].nodeValue.should.equal("test");
                done();
            });
    });

    it("#List dependencies of sponza example", function (done) {
        collada.dependencies(test_dae)
            .then(dependencies => {
                this.timeout(1000);
                should(test_dependencies).be.eql(dependencies);
                done();
            });
    });

    it("#List all model dependencies in test directory", function (done) {
        this.timeout(10000);
        fs.readdir(models_directory, (err, files) => Promise.all(
                files
                    .filter(file => Path.extname(file) === ".dae" || Path.extname(file) === ".DAE")
                    .map(file => collada.dependencies(Path.join(models_directory, file)))
            ).then(() => done()).catch(done)   
        );
    });
});