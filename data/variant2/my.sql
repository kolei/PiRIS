SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table dbo.AgentType
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AgentType` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(50) CHARACTER SET 'utf8mb4' NOT NULL,
  `Image` VARCHAR(100) CHARACTER SET 'utf8mb4' NULL,
  PRIMARY KEY (`ID`));

-- ----------------------------------------------------------------------------
-- Table dbo.Supplier
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Supplier` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(150) CHARACTER SET 'utf8mb4' NOT NULL,
  `INN` VARCHAR(12) NOT NULL,
  `StartDate` DATE NOT NULL,
  `QualityRating` INT NULL,
  `SupplierType` VARCHAR(20) CHARACTER SET 'utf8mb4' NULL,
  PRIMARY KEY (`ID`));

-- ----------------------------------------------------------------------------
-- Table dbo.ProductType
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ProductType` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(50) CHARACTER SET 'utf8mb4' NOT NULL,
  `DefectedPercent` DOUBLE NOT NULL,
  PRIMARY KEY (`ID`));

-- ----------------------------------------------------------------------------
-- Table dbo.Product
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Product` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(100) CHARACTER SET 'utf8mb4' NOT NULL,
  `ProductTypeID` INT NULL,
  `ArticleNumber` VARCHAR(10) CHARACTER SET 'utf8mb4' NOT NULL,
  `Description` LONGTEXT CHARACTER SET 'utf8mb4' NULL,
  `Image` VARCHAR(100) CHARACTER SET 'utf8mb4' NULL,
  `ProductionPersonCount` INT NULL,
  `ProductionWorkshopNumber` INT NULL,
  `MinCostForAgent` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_Product_ProductType`
    FOREIGN KEY (`ProductTypeID`)
    REFERENCES `ProductType` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.MaterialSupplier
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `MaterialSupplier` (
  `MaterialID` INT NOT NULL,
  `SupplierID` INT NOT NULL,
  PRIMARY KEY (`MaterialID`, `SupplierID`),
  CONSTRAINT `FK_MaterialSupplier_Supplier`
    FOREIGN KEY (`SupplierID`)
    REFERENCES `Supplier` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_MaterialSupplier_Material`
    FOREIGN KEY (`MaterialID`)
    REFERENCES `Material` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.MaterialType
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `MaterialType` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(50) CHARACTER SET 'utf8mb4' NOT NULL,
  `DefectedPercent` DOUBLE NOT NULL,
  PRIMARY KEY (`ID`));

-- ----------------------------------------------------------------------------
-- Table dbo.Material
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Material` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(100) CHARACTER SET 'utf8mb4' NOT NULL,
  `CountInPack` INT NOT NULL,
  `Unit` VARCHAR(10) CHARACTER SET 'utf8mb4' NOT NULL,
  `CountInStock` DOUBLE NULL,
  `MinCount` DOUBLE NOT NULL,
  `Description` LONGTEXT CHARACTER SET 'utf8mb4' NULL,
  `Cost` DECIMAL(10,2) NOT NULL,
  `Image` VARCHAR(100) CHARACTER SET 'utf8mb4' NULL,
  `MaterialTypeID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_Material_MaterialType`
    FOREIGN KEY (`MaterialTypeID`)
    REFERENCES `MaterialType` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.ProductMaterial
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ProductMaterial` (
  `ProductID` INT NOT NULL,
  `MaterialID` INT NOT NULL,
  `Count` DOUBLE NULL,
  PRIMARY KEY (`ProductID`, `MaterialID`),
  CONSTRAINT `FK_ProductMaterial_Material`
    FOREIGN KEY (`MaterialID`)
    REFERENCES `Material` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ProductMaterial_Product`
    FOREIGN KEY (`ProductID`)
    REFERENCES `Product` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.ProductSale
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ProductSale` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `AgentID` INT NOT NULL,
  `ProductID` INT NOT NULL,
  `SaleDate` DATE NOT NULL,
  `ProductCount` INT NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_ProductSale_Agent`
    FOREIGN KEY (`AgentID`)
    REFERENCES `Agent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ProductSale_Product`
    FOREIGN KEY (`ProductID`)
    REFERENCES `Product` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.Agent
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Agent` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(150) CHARACTER SET 'utf8mb4' NOT NULL,
  `AgentTypeID` INT NOT NULL,
  `Address` VARCHAR(300) CHARACTER SET 'utf8mb4' NULL,
  `INN` VARCHAR(12) NOT NULL,
  `KPP` VARCHAR(9) NULL,
  `DirectorName` VARCHAR(100) CHARACTER SET 'utf8mb4' NULL,
  `Phone` VARCHAR(20) CHARACTER SET 'utf8mb4' NOT NULL,
  `Email` VARCHAR(255) CHARACTER SET 'utf8mb4' NULL,
  `Logo` VARCHAR(100) CHARACTER SET 'utf8mb4' NULL,
  `Priority` INT NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_Agent_AgentType`
    FOREIGN KEY (`AgentTypeID`)
    REFERENCES `AgentType` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.Shop
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Shop` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(150) CHARACTER SET 'utf8mb4' NOT NULL,
  `Address` VARCHAR(300) CHARACTER SET 'utf8mb4' NULL,
  `AgentID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_Shop_Agent`
    FOREIGN KEY (`AgentID`)
    REFERENCES `Agent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.MaterialCountHistory
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `MaterialCountHistory` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `MaterialID` INT NOT NULL,
  `ChangeDate` DATETIME(6) NOT NULL,
  `CountValue` DOUBLE NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_MaterialCountHistory_Material`
    FOREIGN KEY (`MaterialID`)
    REFERENCES `Material` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.ProductCostHistory
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ProductCostHistory` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `ProductID` INT NOT NULL,
  `ChangeDate` DATETIME(6) NOT NULL,
  `CostValue` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_ProductCostHistory_Product`
    FOREIGN KEY (`ProductID`)
    REFERENCES `Product` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table dbo.AgentPriorityHistory
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AgentPriorityHistory` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `AgentID` INT NOT NULL,
  `ChangeDate` DATETIME(6) NOT NULL,
  `PriorityValue` INT NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `FK_AgentPriorityHistory_Agent`
    FOREIGN KEY (`AgentID`)
    REFERENCES `Agent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
SET FOREIGN_KEY_CHECKS = 1;
