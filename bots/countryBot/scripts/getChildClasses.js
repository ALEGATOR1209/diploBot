'use strict';

const isParent = (parent, child, classlist) => (child.parentClass === parent ?
  true : child.parentClass ?
    isParent(parent, classlist[child.parentClass]) : false
);

const getChildClasses = (className, classlist) => Object.keys(classlist)
  .filter(cls => isParent(className, classlist[cls], classlist));

module.exports = getChildClasses;
